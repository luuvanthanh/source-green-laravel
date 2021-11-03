<?php

namespace GGPHP\Salary\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\BusRegistration\Repositories\Eloquent\BusRegistrationRepositoryEloquent;
use GGPHP\Category\Models\ParamaterFormula;
use GGPHP\Category\Models\ParamaterValue;
use GGPHP\Category\Models\ParameterTax;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\OtherDeclaration\Models\OtherDeclaration;
use GGPHP\Salary\Models\Payroll;
use GGPHP\Salary\Models\PayRollDetail;
use GGPHP\Salary\Presenters\PayrollPresenter;
use GGPHP\Salary\Repositories\Contracts\PayrollRepository;
use GGPHP\Timekeeping\Repositories\Eloquent\TimekeepingRepositoryEloquent;
use GGPHP\Users\Models\User;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;
use alhimik1986\PhpExcelTemplator\params\CallbackParam;
use alhimik1986\PhpExcelTemplator\PhpExcelTemplator;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * Class PayrollRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class PayrollRepositoryEloquent extends CoreRepositoryEloquent implements PayrollRepository
{
    protected $fieldSearchable = [
        'Id',
        'CreationTime',
    ];

    public function __construct(
        ExcelExporterServices $excelExporterServices,
        TimekeepingRepositoryEloquent $timekeepingRepositoryEloquent,
        BusRegistrationRepositoryEloquent $busRegistrationRepositoryEloquent,
        Application $app
    ) {
        parent::__construct($app);
        $this->excelExporterServices = $excelExporterServices;
        $this->busRegistrationRepositoryEloquent = $busRegistrationRepositoryEloquent;
        $this->timekeepingRepositoryEloquent = $timekeepingRepositoryEloquent;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Payroll::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return PayrollPresenter::class;
    }

    public function filterPayroll(array $attributes)
    {
        $payroll = Payroll::where('Month', $attributes['month'])->with(['payrollDetail' => function ($query) use ($attributes) {
            $query->whereHas('employee', function ($q2) use ($attributes) {
                $q2->tranferHistory($attributes);

                if (!empty($attributes['fullName'])) {
                    $q2->whereLike('FullName', $attributes['fullName']);
                }

                if (!empty($attributes['employeeId'])) {
                    $employeeId = explode(',', $attributes['employeeId']);
                    $q2->whereIn('Id', $employeeId);
                }
            });
        }])->first();

        if (is_null($payroll)) {
            $payroll = Payroll::create($attributes);
        }

        return parent::parserResult($payroll);
    }

    public function payslip(array $attributes)
    {
        $payroll = Payroll::findOrFail($attributes['id']);
        $startDate = Carbon::parse($payroll->Month)->subMonth()->setDay(26)->format('Y-m-d');
        $endDate = Carbon::parse($payroll->Month)->setDay(25)->format('Y-m-d');

        $dataInsert = [];
        $numberOfWorkdays = 0;
        $columnBasicSalaryAndAllowance = [];
        $columnIncurredAllowance = [];

        $employees = User::where('Status', User::STATUS['WORKING'])->get();

        $otherDeclaration = OtherDeclaration::where('Time', $payroll->Month)->first();

        if (!is_null($otherDeclaration)) {
            $numberOfWorkdays = $otherDeclaration->NumberOfWorkdays;

            foreach ($employees as &$employee) {
                if ($otherDeclaration->IsDiseaseSalary) {
                    $employee = $this->calculatorSalaryDisease($payroll, $employee, $dataInsert, $startDate, $endDate, $numberOfWorkdays, $otherDeclaration, $columnBasicSalaryAndAllowance, $columnIncurredAllowance);
                } else {
                    $employee = $this->calculatorSalary($payroll, $employee, $dataInsert, $startDate, $endDate, $numberOfWorkdays, $otherDeclaration, $columnBasicSalaryAndAllowance, $columnIncurredAllowance);
                }
            }
            \DB::beginTransaction();

            try {
                $payroll->payrollDetail()->delete();
                PayRollDetail::insert($dataInsert);

                $payroll->update([
                    'columnBasicSalaryAndAllowance' => json_encode(array_values($columnBasicSalaryAndAllowance)),
                    'columnIncurredAllowance' => json_encode(array_values($columnIncurredAllowance)),
                ]);

                $payroll->update(['IsSalary' => true]);

                \DB::commit();
            } catch (\Throwable $th) {
                \DB::rollback();
            }
        }

        return parent::find($attributes['id']);
    }

    public function calculatorSalary($payroll, $employee, &$dataInsert, $startDate, $endDate, $numberOfWorkdays, $otherDeclaration, &$columnBasicSalaryAndAllowance, &$columnIncurredAllowance)
    {
        $month = $payroll->Month;
        $parameter = [];
        $dependentPerson = $employee->children->count();
        $parameter['DIEU_CHINH_BHXH_NLD'] = 0;
        $parameter['SO_NGUOI_PHU_THUOC'] = $dependentPerson;

        $totalWorks = $this->timekeepingRepositoryEloquent->calculatorTimekeepingReport($employee, [
            'startDate' => $startDate,
            'endDate' => $endDate,
        ])->totalWorks;
        $otherDeclarationDetail = $otherDeclaration->otherDeclarationDetail->where('EmployeeId', $employee->Id)->first();

        $incurredAllowance = [];

        $socialInsuranceAdjustedEmployee = 0;
        $socialInsuranceAdjustedCompany = 0;
        $charity = 0;
        $socialInsurancePayment = 0;
        $advance = 0;
        $isMaternity = false;

        $maternityLeave = $employee->maternityLeave()->where(function ($q2) use ($startDate, $endDate) {
            $q2->where([['StartDate', '<=', $startDate], ['EndDate', '>=', $endDate]])
                ->orWhere([['StartDate', '>', $startDate], ['StartDate', '<=', $endDate]])
                ->orWhere([['EndDate', '>=', $startDate], ['EndDate', '<', $endDate]]);
        })->first();

        if (!is_null($maternityLeave)) {
            $isMaternity = true;
        }

        if (!is_null($otherDeclarationDetail)) {
            if (!is_null($otherDeclarationDetail->Detail)) {
                $incurredAllowance = json_decode($otherDeclarationDetail->Detail);
                foreach ($incurredAllowance as $itemIncurredAllowance) {
                    $value = isset($itemIncurredAllowance->value) ? $itemIncurredAllowance->value : $itemIncurredAllowance->valueDefault;

                    if ($itemIncurredAllowance->code === 'DIEU_CHINH_BHXH_NLD') {
                        $parameter['DIEU_CHINH_BHXH_NLD'] = $value;
                        $socialInsuranceAdjustedEmployee = $value;
                    } elseif ($itemIncurredAllowance->code === 'DIEU_CHINH_BHXH_CTT') {
                        $parameter['DIEU_CHINH_BHXH_CTT'] = $value;
                        $socialInsuranceAdjustedCompany = $value;
                    } elseif ($itemIncurredAllowance->code === 'DONG_GOP_TU_THIEN') {
                        $parameter['DONG_GOP_TU_THIEN'] = $value;
                        $charity = $value;
                    } elseif ($itemIncurredAllowance->code === 'THANH_TOAN_TU_BHXH') {
                        $parameter['THANH_TOAN_TU_BHXH'] = $value;
                        $socialInsurancePayment = $value;
                    } elseif ($itemIncurredAllowance->code === 'SO_TIEN_TAM_UNG') {
                        $parameter['SO_TIEN_TAM_UNG'] = $value;
                        $advance = $value;
                    } elseif (!array_key_exists($itemIncurredAllowance->code, $columnIncurredAllowance)) {
                        $columnIncurredAllowance[$itemIncurredAllowance->code] = [
                            'code' => $itemIncurredAllowance->code,
                            'name' => $itemIncurredAllowance->name,
                        ];
                    }

                    $parameter[$itemIncurredAllowance->code] = isset($itemIncurredAllowance->value) ? $itemIncurredAllowance->value : $itemIncurredAllowance->valueDefault;
                }
            }
        }

        $incurredAllowance = json_encode($incurredAllowance);

        $totalBusRegistration = $this->busRegistrationRepositoryEloquent->calculatorBusRegistrationReport($employee, [
            'startDate' => $startDate,
            'endDate' => $endDate,
        ])->totalBusRegistration;

        $isProbation = false;

        $contract = $employee->labourContract()->where('ContractFrom', '<=', $month)->where('ContractTo', '>=', $month)->orderBy('CreationTime', 'DESC')->first();

        if (is_null($contract)) {
            $contract = $employee->probationaryContract()->where('ContractFrom', '<=', $month)->where('ContractTo', '>=', $month)->orderBy('CreationTime', 'DESC')->first();
            if (!is_null($contract)) {
                $isProbation = true;
            }
        }
        $dateStartWork = null;

        if (!is_null($contract) && $totalWorks > 0) {
            $dateStartWork = $contract->ContractFrom->format('Y-m-d');
            $parameterValues = $contract->parameterValues;

            $parameter['SO_NGAY_CHUAN'] = (int) $numberOfWorkdays;
            $parameter['SO_GIO_DI_XE_BUS'] = $totalBusRegistration;
            $parameter['SO_NGAY_LAM_VIEC_TRONG_THANG'] = $totalWorks;

            //Lương cơ bản và phụ cấp
            $basicSalaryAndAllowance = [];
            foreach ($parameterValues as $parameterValue) {

                $basicSalaryAndAllowance[] = [
                    'code' => $parameterValue->Code,
                    'name' => $parameterValue->Name,
                    'value' => $parameterValue->pivot->Value,
                ];

                if (!array_key_exists($parameterValue->Code, $columnBasicSalaryAndAllowance)) {
                    $columnBasicSalaryAndAllowance[$parameterValue->Code] = [
                        'code' => $parameterValue->Code,
                        'name' => $parameterValue->Name,
                    ];
                }
            }

            $basicSalaryAndAllowance = json_encode($basicSalaryAndAllowance);

            //Luong theo giờ
            $salaryByHour = 0;
            $formularSalaryByHour = ParamaterFormula::where('Code', 'LUONG_THEO_GIO')->first();

            if (!is_null($formularSalaryByHour)) {
                $salaryByHour = $this->getFormular(json_decode($formularSalaryByHour->Recipe), $contract, $parameter);
                $salaryByHour = eval('return ' . $salaryByHour . ';');
            }
            $parameter['LUONG_THEO_GIO'] = $salaryByHour;

            // Lương làm thêm không tính thuế
            $totalOtNoFax = 0;
            $formularTotalOtNoFax = ParamaterFormula::where('Code', 'OT_KHONG_TINH_THUE')->first();

            if (!is_null($formularTotalOtNoFax)) {
                $totalOtNoFax = $this->getFormular(json_decode($formularTotalOtNoFax->Recipe), $contract, $parameter);
                $totalOtNoFax = eval('return ' . $totalOtNoFax . ';');
            }
            $parameter['OT_KHONG_TINH_THUE'] = $totalOtNoFax;

            //Tổng lương làm thêm
            $totalOt = 0;
            $formularTotalOt = ParamaterFormula::where('Code', 'TOTAL_OT')->first();

            if (!is_null($formularTotalOt)) {
                $totalOt = $this->getFormular(json_decode($formularTotalOt->Recipe), $contract, $parameter);
                $totalOt = eval('return ' . $totalOt . ';');
            }
            $parameter['TOTAL_OT'] = $totalOt;

            // Lương làm thêm tính thuế
            $totalOtFax = 0;
            $formularTotalOtFax = ParamaterFormula::where('Code', 'OT_TINH_THUE')->first();

            if (!is_null($formularTotalOtFax)) {
                $totalOtFax = $this->getFormular(json_decode($formularTotalOtFax->Recipe), $contract, $parameter);
                $totalOtFax = eval('return ' . $totalOtFax . ';');
            }

            $parameter['OT_TINH_THUE'] = $totalOtFax;

            //bhxh nld
            $socialInsuranceEmployee = 0;
            $formularSocialInsuranceEmployee = ParamaterFormula::where('Code', 'BHXH_NLD')->first();

            if (!is_null($formularSocialInsuranceEmployee)) {
                $socialInsuranceEmployee = $this->getFormular(json_decode($formularSocialInsuranceEmployee->Recipe), $contract, $parameter);
                $socialInsuranceEmployee = eval('return ' . $socialInsuranceEmployee . ';');
            }
            $parameter['BHXH_NLD'] = $socialInsuranceEmployee;

            //bhyt nld
            $healthInsuranceEmployee = 0;
            $formularHealthInsuranceEmployee = ParamaterFormula::where('Code', 'BHYT_NLD')->first();

            if (!is_null($formularHealthInsuranceEmployee)) {
                $healthInsuranceEmployee = $this->getFormular(json_decode($formularHealthInsuranceEmployee->Recipe), $contract, $parameter);
                $healthInsuranceEmployee = eval('return ' . $healthInsuranceEmployee . ';');
            }
            $parameter['BHYT_NLD'] = $healthInsuranceEmployee;

            //bhtn nld
            $unemploymentInsuranceEmployee = 0;
            $formularUnemploymentInsuranceEmployee = ParamaterFormula::where('Code', 'BHTN_NLD')->first();

            if (!is_null($formularUnemploymentInsuranceEmployee)) {
                $unemploymentInsuranceEmployee = $this->getFormular(json_decode($formularUnemploymentInsuranceEmployee->Recipe), $contract, $parameter);
                $unemploymentInsuranceEmployee = eval('return ' . $unemploymentInsuranceEmployee . ';');
            }
            $parameter['BHTN_NLD'] = $unemploymentInsuranceEmployee;

            //Tổng bh nld
            $totalEmployeeInsurance = 0;
            $formularTotalEmployeeInsurance = ParamaterFormula::where('Code', 'TONG_BH_NLD')->first();

            if (!is_null($formularTotalEmployeeInsurance)) {
                $totalEmployeeInsurance = $this->getFormular(json_decode($formularTotalEmployeeInsurance->Recipe), $contract, $parameter);
                $totalEmployeeInsurance = eval('return ' . $totalEmployeeInsurance . ';');
            }
            $parameter['TONG_BH_NLD'] = $totalEmployeeInsurance;

            //bhxh cty
            $socialInsuranceCompany = 0;
            $formularSocialInsuranceCompany = ParamaterFormula::where('Code', 'BHXH_CTT')->first();

            if (!is_null($formularSocialInsuranceCompany)) {
                $socialInsuranceCompany = $this->getFormular(json_decode($formularSocialInsuranceCompany->Recipe), $contract, $parameter);
                $socialInsuranceCompany = eval('return ' . $socialInsuranceCompany . ';');
            }
            $parameter['BHXH_CTT'] = $socialInsuranceCompany;

            //bhyt cty
            $healthInsuranceCompany = 0;
            $formularHealthInsuranceCompany = ParamaterFormula::where('Code', 'BHYT_CTT')->first();

            if (!is_null($formularHealthInsuranceCompany)) {
                $healthInsuranceCompany = $this->getFormular(json_decode($formularHealthInsuranceCompany->Recipe), $contract, $parameter);
                $healthInsuranceCompany = eval('return ' . $healthInsuranceCompany . ';');
            }
            $parameter['BHYT_CTT'] = $healthInsuranceCompany;

            //bhtn cty
            $unemploymentInsuranceCompany = 0;
            $formularUnemploymentInsuranceCompany = ParamaterFormula::where('Code', 'BHTN_CTT')->first();

            if (!is_null($formularUnemploymentInsuranceCompany)) {
                $unemploymentInsuranceCompany = $this->getFormular(json_decode($formularUnemploymentInsuranceCompany->Recipe), $contract, $parameter);
                $unemploymentInsuranceCompany = eval('return ' . $unemploymentInsuranceCompany . ';');
            }
            $parameter['BHTN_CTT'] = $unemploymentInsuranceCompany;

            //Tổng bh cty
            $totalCompanyInsurance = 0;
            $formularTotalCompanyInsurance = ParamaterFormula::where('Code', 'TONG_BH_CTT')->first();

            if (!is_null($formularTotalCompanyInsurance)) {
                $totalCompanyInsurance = $this->getFormular(json_decode($formularTotalCompanyInsurance->Recipe), $contract, $parameter);
                $totalCompanyInsurance = eval('return ' . $totalCompanyInsurance . ';');
            }
            $parameter['TONG_BH_CTT'] = $totalCompanyInsurance;

            //phí công đoàn
            $unionDues = 0;
            $formularUnionDues = ParamaterFormula::where('Code', 'PHI_CONG_DOAN')->first();

            if (!is_null($formularUnionDues)) {
                $unionDues = $this->getFormular(json_decode($formularUnionDues->Recipe), $contract, $parameter);
                $unionDues = eval('return ' . $unionDues . ';');
            }
            $parameter['PHI_CONG_DOAN'] = $unionDues;

            // phụ cấp xe bus
            $busAllowance = 0;
            $formularBusAllowance = ParamaterFormula::where('Code', 'PC_BUS')->first();

            if (!is_null($formularBusAllowance)) {
                $busAllowance = $this->getFormular(json_decode($formularBusAllowance->Recipe), $contract, $parameter);
                $busAllowance = eval('return ' . $busAllowance . ';');
            }
            $parameter['PC_BUS'] = $busAllowance;

            // phụ cấp theo hd
            $contractAllowance = 0;
            $formularContractAllowance = ParamaterFormula::where('Code', 'PC_THEOHD')->first();

            if (!is_null($formularContractAllowance)) {
                $contractAllowance = $this->getFormular(json_decode($formularContractAllowance->Recipe), $contract, $parameter);
                $contractAllowance = eval('return ' . $contractAllowance . ';');
            }
            $parameter['PC_THEOHD'] = $contractAllowance;

            //giảm trừ phụ cấp ăn trưa
            $lunchAllowanceReduction = 0;
            $formularLunchAllowanceReduction = ParamaterFormula::where('Code', 'GIAMTRU_PC_AN_TRUA')->first();

            if (!is_null($formularLunchAllowanceReduction)) {
                $lunchAllowanceReduction = $this->getFormular(json_decode($formularLunchAllowanceReduction->Recipe), $contract, $parameter);
                $lunchAllowanceReduction = eval('return ' . $lunchAllowanceReduction . ';');
            }
            $parameter['GIAMTRU_PC_AN_TRUA'] = $lunchAllowanceReduction <= 730000 ? $lunchAllowanceReduction : 730000;

            //phụ cấp hàng tháng
            $monthlyAllowance = 0;
            $formularMonthlyAllowance = ParamaterFormula::where('Code', 'PC_HANGTHANG')->first();

            if (!is_null($formularMonthlyAllowance)) {
                $monthlyAllowance = $this->getFormular(json_decode($formularMonthlyAllowance->Recipe), $contract, $parameter);
                $monthlyAllowance = eval('return ' . $monthlyAllowance . ';');
            }
            $parameter['PC_HANGTHANG'] = $monthlyAllowance;

            //tổng thu nhập
            $totalIncome = 0;
            $formularTotalIncome = ParamaterFormula::where('Code', 'TONG_THUNHAP')->first();

            if (!is_null($formularTotalIncome)) {
                $totalIncome = $this->getFormular(json_decode($formularTotalIncome->Recipe), $contract, $parameter);
                $totalIncome = eval('return ' . $totalIncome . ';');
            }
            $parameter['TONG_THUNHAP'] = $totalIncome;

            //tổng thu nhập trong tháng
            $totalIncomeMonth = 0;
            $formularTotalIncomeMonth = ParamaterFormula::where('Code', 'TONG_THUNHAP_TRONG_THANG_NV_CHINH_THUC')->first();

            if ($isProbation) {
                $formularTotalIncomeMonth = ParamaterFormula::where('Code', 'TONG_THUNHAP_TRONG_THANG_NV_THU_VIEC')->first();
            }

            if (!is_null($formularTotalIncomeMonth)) {
                $totalIncomeMonth = $this->getFormular(json_decode($formularTotalIncomeMonth->Recipe), $contract, $parameter);
                $totalIncomeMonth = eval('return ' . $totalIncomeMonth . ';');
            }
            $parameter['TONG_THUNHAP_TRONG_THANG'] = $totalIncomeMonth;

            // tổng giảm trừ bản thân và người phụ thuộc
            $eeduce = 0;
            $formularDependentPerson = ParamaterFormula::where('Code', 'TONG_GIAMTRU_BANTHAN_PHUTHUOC')->first();

            if (!is_null($formularDependentPerson)) {
                $eeduce = $this->getFormular(json_decode($formularDependentPerson->Recipe), $contract, $parameter);
                $eeduce = eval('return ' . $eeduce . ';');
            }
            $parameter['TONG_GIAMTRU_BANTHAN_PHUTHUOC'] = $eeduce;

            //tổng giảm trừ
            $dependentTotal = 0;
            $formularDependentTotal = ParamaterFormula::where('Code', 'TONG_GIAMTRU')->first();

            if (!is_null($formularDependentTotal)) {
                $dependentTotal = $this->getFormular(json_decode($formularDependentTotal->Recipe), $contract, $parameter);
                $dependentTotal = eval('return ' . $dependentTotal . ';');
            }
            $parameter['TONG_GIAMTRU'] = $dependentTotal;

            // thu nhập tính thuế
            $rentalIncome = 0;
            $formularRentalIncome = ParamaterFormula::where('Code', 'THUNHAP_TINHTHUE')->first();

            if ($totalIncomeMonth > $dependentTotal) {
                if (!is_null($formularRentalIncome)) {
                    $rentalIncome = $this->getFormular(json_decode($formularRentalIncome->Recipe), $contract, $parameter);
                    $rentalIncome = eval('return ' . $rentalIncome . ';');
                    $rentalIncome = $rentalIncome > 0 ? $rentalIncome : 0;
                }
            }

            $parameter['THUNHAP_TINHTHUE'] = $rentalIncome;

            // thuế tncn
            $personalIncomeTax = 0;
            if ($rentalIncome > 0) {

                if ($isProbation) {
                    if ($totalIncome >= 2000000) {
                        $personalIncomeTax = $totalIncome * 0.1;
                    }
                } else {
                    $tax = ParameterTax::where(function ($query) use ($rentalIncome) {
                        $query->where([['From', '<=', (int) $rentalIncome], ['To', '>=', (int) $rentalIncome]])
                            ->orWhere([['From', '<=', (int) $rentalIncome], ['To', null]]);
                    })->first();

                    if (!is_null($tax)) {
                        switch ($tax->Code) {
                            case 'CAP_1':
                                $personalIncomeTax = $rentalIncome * ($tax->Fax / 100);
                                break;
                            default:
                                $personalIncomeTax = round($this->calculateTax($rentalIncome, $tax->Fax));
                                break;
                        }
                    }
                }
            }
            $parameter['THUE_TNCN'] = $personalIncomeTax;

            //lương thực nhận
            $actuallyReceived = 0;
            $formularActuallyReceived = ParamaterFormula::where('Code', 'LUONG_THUC_NHAN')->first();
            if (!is_null($formularActuallyReceived)) {
                $actuallyReceived = $this->getFormular(json_decode($formularActuallyReceived->Recipe), $contract, $parameter);
                $actuallyReceived = eval('return ' . $actuallyReceived . ';');
            }
            $parameter['LUONG_THUC_NHAN'] = $actuallyReceived;

            $dataInsert[] = [
                'Id' => \Webpatser\Uuid\Uuid::generate(4)->string,
                'PayrollId' => $payroll->Id,
                'EmployeeId' => $employee->Id,
                'DateStartWork' => $dateStartWork, // ngày bắt đầu làm việc
                'IsProbation' => $isProbation, //thử việc
                'IsMaternity' => $isMaternity, //Nghỉ không lương/Thai sản
                'IsSocialInsurance' => false, //Không tham gia BHXH
                'BasicSalaryAndAllowance' => $basicSalaryAndAllowance, //Lương cơ bản + Phụ Cấp
                'IncurredAllowance' => $incurredAllowance, //PHỤ CẤP PHÁT SINH TRONG THÁNG
                'TotalIncome' => (int) $totalIncome, //TỔNG THU NHẬP
                'KpiBonus' => null, //THƯỞNG KPI
                'OtTax' => (int) $totalOtFax, //Tính thuế
                'OtNoTax' => (int) $totalOtNoFax, //"không tính thuế"
                'UnpaidLeave' => null, //Nghỉ không lương
                'TotalWork' => (int) $totalWorks, //Ngày công thực tế trong tháng
                'TotalIncomeMonth' => (int) $totalIncomeMonth, //TỔNG THU NHẬP TRONG THÁNG
                'SocialInsuranceEmployee' => (int) $socialInsuranceEmployee, //BHXH nld
                'SocialInsuranceAdjustedEmployee' => $socialInsuranceAdjustedEmployee, //Điều chỉnh BHXH nld
                'SocialInsuranceCompany' => (int) $socialInsuranceCompany, //BHXH cty
                'SocialInsuranceAdjustedCompany' => $socialInsuranceAdjustedCompany, //Điều chỉnh BHXH cty
                'HealthInsuranceEmployee' => (int) $healthInsuranceEmployee, //BHYT  nld
                'HealthInsuranceCompany' => (int) $healthInsuranceCompany, //BHYT  cty
                'UnemploymentInsuranceEmployee' => (int) $unemploymentInsuranceEmployee, //BHTN nld
                'UnemploymentInsuranceCompany' => (int) $unemploymentInsuranceCompany, //BHTN cty
                'UnionDues' => $unionDues, //Phí công đoàn
                'DependentPerson' => $dependentPerson, //Số người phụ thuộc
                'Eeduce' => $eeduce, //Tổng giảm trừ bản thân và người phụ thuộc
                'Charity' => $charity, //Đóng góp từ thiện
                'TotalReduce' => (int) $dependentTotal, //Tổng các khoản giảm trừ
                'RentalIncome' => (int) $rentalIncome, //Thu nhập tính thuế
                'PersonalIncomeTax' => (int) $personalIncomeTax, //Thuế TNCN
                'SocialInsurancePayment' => $socialInsurancePayment, //Thanh toán từ BHXH
                'Advance' => $advance, // tạm ứng
                'ActuallyReceived' => (int) $actuallyReceived, // Net income - Lương thực nhận
                'Note' => null, // ghi chú
                'SalaryByHour' => $salaryByHour, // lương theo giờ
            ];
        }

        return true;
    }

    public function calculatorSalaryDisease($payroll, $employee, &$dataInsert, $startDate, $endDate, $numberOfWorkdays, $otherDeclaration, &$columnBasicSalaryAndAllowance, &$columnIncurredAllowance)
    {
        $month = $payroll->Month;
        $parameter = [];
        $dependentPerson = $employee->children->count();
        $parameter['DIEU_CHINH_BHXH_NLD'] = 0;
        $parameter['SO_NGUOI_PHU_THUOC'] = $dependentPerson;

        $totalWorks = $this->timekeepingRepositoryEloquent->calculatorTimekeepingReport($employee, [
            'startDate' => $startDate,
            'endDate' => $endDate,
        ])->totalWorks;
        $otherDeclarationDetail = $otherDeclaration->otherDeclarationDetail->where('EmployeeId', $employee->Id)->first();

        $incurredAllowance = [];

        $socialInsuranceAdjustedEmployee = 0;
        $socialInsuranceAdjustedCompany = 0;
        $charity = 0;
        $socialInsurancePayment = 0;
        $advance = 0;
        $isMaternity = false;
        $bassicSalary = 0;

        $maternityLeave = $employee->maternityLeave()->where(function ($q2) use ($startDate) {
            $q2->where([['StartDate', '<=', $startDate], ['EndDate', '>=', $startDate]]);
        })->first();

        if (!is_null($otherDeclarationDetail)) {
            if (!is_null($otherDeclarationDetail->Detail)) {
                $incurredAllowance = json_decode($otherDeclarationDetail->Detail);
                foreach ($incurredAllowance as $itemIncurredAllowance) {
                    $value = isset($itemIncurredAllowance->value) ? $itemIncurredAllowance->value : $itemIncurredAllowance->valueDefault;

                    if ($itemIncurredAllowance->code === 'DONG_GOP_TU_THIEN') {
                        $parameter['DONG_GOP_TU_THIEN'] = $value;
                        $charity = $value;

                        if (!array_key_exists($itemIncurredAllowance->code, $columnIncurredAllowance)) {
                            $columnIncurredAllowance[$itemIncurredAllowance->code] = [
                                'code' => $itemIncurredAllowance->code,
                                'name' => $itemIncurredAllowance->name,
                            ];
                        }

                        $parameter[$itemIncurredAllowance->code] = isset($itemIncurredAllowance->value) ? $itemIncurredAllowance->value : $itemIncurredAllowance->valueDefault;
                    }
                }
            }
        }

        $incurredAllowance = json_encode($incurredAllowance);

        $totalBusRegistration = $this->busRegistrationRepositoryEloquent->calculatorBusRegistrationReport($employee, [
            'startDate' => $startDate,
            'endDate' => $endDate,
        ])->totalBusRegistration;

        $isProbation = false;

        $contract = $employee->labourContract()->where('ContractFrom', '<=', $month)->where('ContractTo', '>=', $month)->orderBy('CreationTime', 'DESC')->first();

        if (is_null($contract)) {
            $contract = $employee->probationaryContract()->where('ContractFrom', '<=', $month)->where('ContractTo', '>=', $month)->orderBy('CreationTime', 'DESC')->first();
            if (!is_null($contract)) {
                $isProbation = true;
            }
        }
        $dateStartWork = null;

        if (!is_null($maternityLeave)) {
            $isMaternity = true;
            if (!is_null($contract)) {
                $dateStartWork = $contract->ContractFrom->format('Y-m-d');
                $parameterValues = $contract->parameterValues;

                $parameter['SO_NGAY_CHUAN'] = 0;
                $parameter['SO_GIO_DI_XE_BUS'] = 0;
                $parameter['SO_NGAY_LAM_VIEC_TRONG_THANG'] = 0;
                //Lương cơ bản và phụ cấp
                $basicSalaryAndAllowance = [];
                foreach ($parameterValues as $parameterValue) {
                    if ($parameterValue->Code == "LUONG_CB") {
                        $bassicSalary = $parameterValue->pivot->Value;
                        $basicSalaryAndAllowance[] = [
                            'code' => $parameterValue->Code,
                            'name' => $parameterValue->Name,
                            'value' => $parameterValue->pivot->Value,
                        ];
                    } else {
                        $basicSalaryAndAllowance[] = [
                            'code' => $parameterValue->Code,
                            'name' => $parameterValue->Name,
                            'value' => 0,
                        ];
                    }

                    if (!array_key_exists($parameterValue->Code, $columnBasicSalaryAndAllowance)) {
                        $columnBasicSalaryAndAllowance[$parameterValue->Code] = [
                            'code' => $parameterValue->Code,
                            'name' => $parameterValue->Name,
                        ];
                    }
                }

                $basicSalaryAndAllowance = json_encode($basicSalaryAndAllowance);

                //Luong theo giờ
                $salaryByHour = 0;
                $parameter['LUONG_THEO_GIO'] = $salaryByHour;

                // Lương làm thêm không tính thuế
                $totalOtNoFax = 0;
                $parameter['OT_KHONG_TINH_THUE'] = $totalOtNoFax;

                //Tổng lương làm thêm
                $totalOt = 0;
                $parameter['TOTAL_OT'] = $totalOt;

                // Lương làm thêm tính thuế
                $totalOtFax = 0;
                $parameter['OT_TINH_THUE'] = $totalOtFax;

                //bhxh nld
                $socialInsuranceEmployee = 0;
                $formularSocialInsuranceEmployee = ParamaterFormula::where('Code', 'BHXH_NLD')->first();

                if (!is_null($formularSocialInsuranceEmployee)) {
                    $socialInsuranceEmployee = $this->getFormular(json_decode($formularSocialInsuranceEmployee->Recipe), $contract, $parameter);
                    $socialInsuranceEmployee = eval('return ' . $socialInsuranceEmployee . ';');
                }
                $parameter['BHXH_NLD'] = $socialInsuranceEmployee;

                //bhyt nld
                $healthInsuranceEmployee = 0;
                $formularHealthInsuranceEmployee = ParamaterFormula::where('Code', 'BHYT_NLD')->first();

                if (!is_null($formularHealthInsuranceEmployee)) {
                    $healthInsuranceEmployee = $this->getFormular(json_decode($formularHealthInsuranceEmployee->Recipe), $contract, $parameter);
                    $healthInsuranceEmployee = eval('return ' . $healthInsuranceEmployee . ';');
                }
                $parameter['BHYT_NLD'] = $healthInsuranceEmployee;

                //bhtn nld
                $unemploymentInsuranceEmployee = 0;
                $formularUnemploymentInsuranceEmployee = ParamaterFormula::where('Code', 'BHTN_NLD')->first();

                if (!is_null($formularUnemploymentInsuranceEmployee)) {
                    $unemploymentInsuranceEmployee = $this->getFormular(json_decode($formularUnemploymentInsuranceEmployee->Recipe), $contract, $parameter);
                    $unemploymentInsuranceEmployee = eval('return ' . $unemploymentInsuranceEmployee . ';');
                }
                $parameter['BHTN_NLD'] = $unemploymentInsuranceEmployee;

                //Tổng bh nld
                $totalEmployeeInsurance = 0;
                $formularTotalEmployeeInsurance = ParamaterFormula::where('Code', 'TONG_BH_NLD')->first();

                if (!is_null($formularTotalEmployeeInsurance)) {
                    $totalEmployeeInsurance = $this->getFormular(json_decode($formularTotalEmployeeInsurance->Recipe), $contract, $parameter);
                    $totalEmployeeInsurance = eval('return ' . $totalEmployeeInsurance . ';');
                }
                $parameter['TONG_BH_NLD'] = $totalEmployeeInsurance;

                //bhxh cty
                $socialInsuranceCompany = 0;
                $parameter['BHXH_CTT'] = $socialInsuranceCompany;

                //bhyt cty
                $healthInsuranceCompany = 0;
                $parameter['BHYT_CTT'] = $healthInsuranceCompany;

                //bhtn cty
                $unemploymentInsuranceCompany = 0;
                $parameter['BHTN_CTT'] = $unemploymentInsuranceCompany;

                //Tổng bh cty
                $totalCompanyInsurance = 0;
                $parameter['TONG_BH_CTT'] = $totalCompanyInsurance;

                //phí công đoàn
                $unionDues = 0;
                $parameter['PHI_CONG_DOAN'] = $unionDues;

                // phụ cấp xe bus
                $busAllowance = 0;
                $parameter['PC_BUS'] = $busAllowance;

                //phụ cấp hàng tháng
                $monthlyAllowance = 0;
                $parameter['PC_HANGTHANG'] = $monthlyAllowance;

                //tổng thu nhập
                $totalIncome = 0;

                // phụ cấp theo hd
                $contractAllowance = 0;
                $parameter['PC_THEOHD'] = $contractAllowance;

                //giảm trừ phụ cấp ăn trưa
                $lunchAllowanceReduction = 0;
                $parameter['GIAMTRU_PC_AN_TRUA'] = $lunchAllowanceReduction;

                $parameter['TONG_THUNHAP'] = $bassicSalary;

                //tổng thu nhập trong tháng
                $totalIncomeMonth = 0;
                $totalIncomeMonth = $bassicSalary;
                $parameter['TONG_THUNHAP_TRONG_THANG'] = $bassicSalary;

                // tổng giảm trừ bản thân và người phụ thuộc
                $eeduce = 0;
                $parameter['TONG_GIAMTRU_BANTHAN_PHUTHUOC'] = $eeduce;

                //tổng giảm trừ
                $dependentTotal = 0;
                $parameter['TONG_GIAMTRU'] = $dependentTotal;

                // thu nhập tính thuế
                $rentalIncome = 0;
                $parameter['THUNHAP_TINHTHUE'] = $rentalIncome;

                // thuế tncn
                $personalIncomeTax = 0;
                $parameter['THUE_TNCN'] = $personalIncomeTax;

                //lương thực nhận
                $actuallyReceived = 0;
                $actuallyReceived = $bassicSalary - $totalEmployeeInsurance;
                $parameter['LUONG_THUC_NHAN'] = $actuallyReceived;

                $dataInsert[] = [
                    'Id' => \Webpatser\Uuid\Uuid::generate(4)->string,
                    'PayrollId' => $payroll->Id,
                    'EmployeeId' => $employee->Id,
                    'DateStartWork' => $dateStartWork, // ngày bắt đầu làm việc
                    'IsProbation' => $isProbation, //thử việc
                    'IsMaternity' => $isMaternity, //Nghỉ không lương/Thai sản
                    'IsSocialInsurance' => false, //Không tham gia BHXH
                    'BasicSalaryAndAllowance' => $basicSalaryAndAllowance, //Lương cơ bản + Phụ Cấp
                    'IncurredAllowance' => $incurredAllowance, //PHỤ CẤP PHÁT SINH TRONG THÁNG
                    'TotalIncome' => (int) $totalIncome, //TỔNG THU NHẬP
                    'KpiBonus' => null, //THƯỞNG KPI
                    'OtTax' => (int) $totalOtFax, //Tính thuế
                    'OtNoTax' => (int) $totalOtNoFax, //"không tính thuế"
                    'UnpaidLeave' => null, //Nghỉ không lương
                    'TotalWork' => (int) $totalWorks, //Ngày công thực tế trong tháng
                    'TotalIncomeMonth' => (int) $totalIncomeMonth, //TỔNG THU NHẬP TRONG THÁNG
                    'SocialInsuranceEmployee' => (int) $socialInsuranceEmployee, //BHXH nld
                    'SocialInsuranceAdjustedEmployee' => $socialInsuranceAdjustedEmployee, //Điều chỉnh BHXH nld
                    'SocialInsuranceCompany' => (int) $socialInsuranceCompany, //BHXH cty
                    'SocialInsuranceAdjustedCompany' => $socialInsuranceAdjustedCompany, //Điều chỉnh BHXH cty
                    'HealthInsuranceEmployee' => (int) $healthInsuranceEmployee, //BHYT  nld
                    'HealthInsuranceCompany' => (int) $healthInsuranceCompany, //BHYT  cty
                    'UnemploymentInsuranceEmployee' => (int) $unemploymentInsuranceEmployee, //BHTN nld
                    'UnemploymentInsuranceCompany' => (int) $unemploymentInsuranceCompany, //BHTN cty
                    'UnionDues' => $unionDues, //Phí công đoàn
                    'DependentPerson' => $dependentPerson, //Số người phụ thuộc
                    'Eeduce' => $eeduce, //Tổng giảm trừ bản thân và người phụ thuộc
                    'Charity' => $charity, //Đóng góp từ thiện
                    'TotalReduce' => (int) $dependentTotal, //Tổng các khoản giảm trừ
                    'RentalIncome' => (int) $rentalIncome, //Thu nhập tính thuế
                    'PersonalIncomeTax' => (int) $personalIncomeTax, //Thuế TNCN
                    'SocialInsurancePayment' => $socialInsurancePayment, //Thanh toán từ BHXH
                    'Advance' => $advance, // tạm ứng
                    'ActuallyReceived' => (int) $actuallyReceived, // Net income - Lương thực nhận
                    'Note' => null, // ghi chú,
                    'SalaryByHour' => $salaryByHour,
                ];
            }
        } else {
            if (!is_null($contract) && $totalWorks > 0) {
                $dateStartWork = $contract->ContractFrom->format('Y-m-d');
                $parameterValues = $contract->parameterValues;

                $parameter['SO_NGAY_CHUAN'] = (int) $numberOfWorkdays;
                $parameter['SO_GIO_DI_XE_BUS'] = $totalBusRegistration;
                $parameter['SO_NGAY_LAM_VIEC_TRONG_THANG'] = $totalWorks;
                //Lương cơ bản và phụ cấp
                $basicSalaryAndAllowance = [];
                foreach ($parameterValues as $parameterValue) {
                    if ($parameterValue->Code == "LUONG_CB") {
                        $bassicSalary = $parameterValue->pivot->Value;
                    }

                    $basicSalaryAndAllowance[] = [
                        'code' => $parameterValue->Code,
                        'name' => $parameterValue->Name,
                        'value' => $parameterValue->pivot->Value,
                    ];

                    if (!array_key_exists($parameterValue->Code, $columnBasicSalaryAndAllowance)) {
                        $columnBasicSalaryAndAllowance[$parameterValue->Code] = [
                            'code' => $parameterValue->Code,
                            'name' => $parameterValue->Name,
                        ];
                    }
                }

                $basicSalaryAndAllowance = json_encode($basicSalaryAndAllowance);

                //Luong theo giờ
                $salaryByHour = 0;
                $formularSalaryByHour = ParamaterFormula::where('Code', 'LUONG_THEO_GIO')->first();

                if (!is_null($formularSalaryByHour)) {
                    $salaryByHour = $this->getFormular(json_decode($formularSalaryByHour->Recipe), $contract, $parameter);
                    $salaryByHour = eval('return ' . $salaryByHour . ';');
                }
                $parameter['LUONG_THEO_GIO'] = $salaryByHour;

                // Lương làm thêm không tính thuế
                $totalOtNoFax = 0;
                $formularTotalOtNoFax = ParamaterFormula::where('Code', 'OT_KHONG_TINH_THUE')->first();
                if (!is_null($formularTotalOtNoFax)) {
                    $totalOtNoFax = $this->getFormular(json_decode($formularTotalOtNoFax->Recipe), $contract, $parameter);
                    $totalOtNoFax = eval('return ' . $totalOtNoFax . ';');
                }
                $parameter['OT_KHONG_TINH_THUE'] = $totalOtNoFax;

                //Tổng lương làm thêm
                $totalOt = 0;
                $parameter['TOTAL_OT'] = $totalOt;

                // Lương làm thêm tính thuế
                $totalOtFax = 0;
                $parameter['OT_TINH_THUE'] = $totalOtFax;

                //bhxh nld
                $socialInsuranceEmployee = 0;
                $parameter['BHXH_NLD'] = $socialInsuranceEmployee;

                //bhyt nld
                $healthInsuranceEmployee = 0;
                $parameter['BHYT_NLD'] = $healthInsuranceEmployee;

                //bhtn nld
                $unemploymentInsuranceEmployee = 0;
                $parameter['BHTN_NLD'] = $unemploymentInsuranceEmployee;

                //Tổng bh nld
                $totalEmployeeInsurance = 0;
                $parameter['TONG_BH_NLD'] = $totalEmployeeInsurance;

                //bhxh cty
                $socialInsuranceCompany = 0;
                $parameter['BHXH_CTT'] = $socialInsuranceCompany;

                //bhyt cty
                $healthInsuranceCompany = 0;
                $parameter['BHYT_CTT'] = $healthInsuranceCompany;

                //bhtn cty
                $unemploymentInsuranceCompany = 0;
                $parameter['BHTN_CTT'] = $unemploymentInsuranceCompany;

                //Tổng bh cty
                $totalCompanyInsurance = 0;
                $parameter['TONG_BH_CTT'] = $totalCompanyInsurance;

                //phí công đoàn
                $unionDues = 0;
                $parameter['PHI_CONG_DOAN'] = $unionDues;

                // phụ cấp xe bus
                $busAllowance = 0;
                $parameter['PC_BUS'] = $busAllowance;

                //phụ cấp hàng tháng
                $monthlyAllowance = 0;
                $parameter['PC_HANGTHANG'] = $monthlyAllowance;

                //giảm trừ phụ cấp ăn trưa
                $lunchAllowanceReduction = 0;
                $formularLunchAllowanceReduction = ParamaterFormula::where('Code', 'GIAMTRU_PC_AN_TRUA')->first();

                if (!is_null($formularLunchAllowanceReduction)) {
                    $lunchAllowanceReduction = $this->getFormular(json_decode($formularLunchAllowanceReduction->Recipe), $contract, $parameter);
                    $lunchAllowanceReduction = eval('return ' . $lunchAllowanceReduction . ';');
                }
                $parameter['GIAMTRU_PC_AN_TRUA'] = $lunchAllowanceReduction <= 730000 ? $lunchAllowanceReduction : 730000;

                //tổng thu nhập
                $totalIncome = 0;

                // phụ cấp theo hd
                $contractAllowance = 0;
                $formularContractAllowance = ParamaterFormula::where('Code', 'PC_THEOHD')->first();

                if (!is_null($formularContractAllowance)) {
                    $contractAllowance = $this->getFormular(json_decode($formularContractAllowance->Recipe), $contract, $parameter);
                    $contractAllowance = eval('return ' . $contractAllowance . ';');
                }
                $parameter['PC_THEOHD'] = $contractAllowance;

                $formularTotalIncome = ParamaterFormula::where('Code', 'TONG_THUNHAP')->first();

                if (!is_null($formularTotalIncome)) {
                    $totalIncome = $this->getFormular(json_decode($formularTotalIncome->Recipe), $contract, $parameter);
                    $totalIncome = eval('return ' . $totalIncome . ';');
                }

                $parameter['TONG_THUNHAP'] = $bassicSalary;

                //tổng thu nhập trong tháng
                $totalIncomeMonth = 0;
                $formularTotalIncomeMonth = ParamaterFormula::where('Code', 'TONG_THUNHAP_TRONG_THANG_NV_CHINH_THUC')->first();

                if ($isProbation) {
                    $formularTotalIncomeMonth = ParamaterFormula::where('Code', 'TONG_THUNHAP_TRONG_THANG_NV_THU_VIEC')->first();
                }

                if (!is_null($formularTotalIncomeMonth)) {
                    $totalIncomeMonth = $this->getFormular(json_decode($formularTotalIncomeMonth->Recipe), $contract, $parameter);
                    $totalIncomeMonth = eval('return ' . $totalIncomeMonth . ';');
                }
                $parameter['TONG_THUNHAP_TRONG_THANG'] = $totalIncomeMonth;
                // tổng giảm trừ bản thân và người phụ thuộc
                $eeduce = 0;
                $formularDependentPerson = ParamaterFormula::where('Code', 'TONG_GIAMTRU_BANTHAN_PHUTHUOC')->first();

                if (!is_null($formularDependentPerson)) {
                    $eeduce = $this->getFormular(json_decode($formularDependentPerson->Recipe), $contract, $parameter);
                    $eeduce = eval('return ' . $eeduce . ';');
                }
                $parameter['TONG_GIAMTRU_BANTHAN_PHUTHUOC'] = $eeduce;

                //tổng giảm trừ
                $dependentTotal = 0;
                $formularDependentTotal = ParamaterFormula::where('Code', 'TONG_GIAMTRU')->first();

                if (!is_null($formularDependentTotal)) {
                    $dependentTotal = $this->getFormular(json_decode($formularDependentTotal->Recipe), $contract, $parameter);
                    $dependentTotal = eval('return ' . $dependentTotal . ';');
                }

                $parameter['TONG_GIAMTRU'] = $dependentTotal;

                // thu nhập tính thuế
                $rentalIncome = 0;
                // thuế tncn
                $personalIncomeTax = 0;

                if ($totalIncomeMonth > 11000000) {
                    $rentalIncome = $totalIncomeMonth - $dependentTotal;

                    $rentalIncome = $rentalIncome > 0 ? $rentalIncome : 0;
                    if ($rentalIncome > 0) {
                        $tax = ParameterTax::where(function ($query) use ($rentalIncome) {
                            $query->where([['From', '<=', (int) $rentalIncome], ['To', '>=', (int) $rentalIncome]])
                                ->orWhere([['From', '<=', (int) $rentalIncome], ['To', null]]);
                        })->first();

                        if (!is_null($tax)) {
                            switch ($tax->Code) {
                                case 'CAP_1':
                                    $personalIncomeTax = $rentalIncome * ($tax->Fax / 100);
                                    break;
                                default:
                                    $personalIncomeTax = round($this->calculateTax($rentalIncome, $tax->Fax));
                                    break;
                            }
                        }
                    }
                }

                $parameter['THUNHAP_TINHTHUE'] = $rentalIncome;

                $parameter['THUE_TNCN'] = $personalIncomeTax;

                //lương thực nhận
                $actuallyReceived = 0;
                $formularActuallyReceived = ParamaterFormula::where('Code', 'LUONG_THUC_NHAN')->first();
                if (!is_null($formularActuallyReceived)) {
                    $actuallyReceived = $this->getFormular(json_decode($formularActuallyReceived->Recipe), $contract, $parameter);
                    $actuallyReceived = eval('return ' . $actuallyReceived . ';');
                }
                $parameter['LUONG_THUC_NHAN'] = $actuallyReceived;

                $dataInsert[] = [
                    'Id' => \Webpatser\Uuid\Uuid::generate(4)->string,
                    'PayrollId' => $payroll->Id,
                    'EmployeeId' => $employee->Id,
                    'DateStartWork' => $dateStartWork, // ngày bắt đầu làm việc
                    'IsProbation' => $isProbation, //thử việc
                    'IsMaternity' => $isMaternity, //Nghỉ không lương/Thai sản
                    'IsSocialInsurance' => false, //Không tham gia BHXH
                    'BasicSalaryAndAllowance' => $basicSalaryAndAllowance, //Lương cơ bản + Phụ Cấp
                    'IncurredAllowance' => $incurredAllowance, //PHỤ CẤP PHÁT SINH TRONG THÁNG
                    'TotalIncome' => (int) $totalIncome, //TỔNG THU NHẬP
                    'KpiBonus' => null, //THƯỞNG KPI
                    'OtTax' => (int) $totalOtFax, //Tính thuế
                    'OtNoTax' => (int) $totalOtNoFax, //"không tính thuế"
                    'UnpaidLeave' => null, //Nghỉ không lương
                    'TotalWork' => (int) $totalWorks, //Ngày công thực tế trong tháng
                    'TotalIncomeMonth' => (int) $totalIncomeMonth, //TỔNG THU NHẬP TRONG THÁNG
                    'SocialInsuranceEmployee' => (int) $socialInsuranceEmployee, //BHXH nld
                    'SocialInsuranceAdjustedEmployee' => $socialInsuranceAdjustedEmployee, //Điều chỉnh BHXH nld
                    'SocialInsuranceCompany' => (int) $socialInsuranceCompany, //BHXH cty
                    'SocialInsuranceAdjustedCompany' => $socialInsuranceAdjustedCompany, //Điều chỉnh BHXH cty
                    'HealthInsuranceEmployee' => (int) $healthInsuranceEmployee, //BHYT  nld
                    'HealthInsuranceCompany' => (int) $healthInsuranceCompany, //BHYT  cty
                    'UnemploymentInsuranceEmployee' => (int) $unemploymentInsuranceEmployee, //BHTN nld
                    'UnemploymentInsuranceCompany' => (int) $unemploymentInsuranceCompany, //BHTN cty
                    'UnionDues' => $unionDues, //Phí công đoàn
                    'DependentPerson' => $dependentPerson, //Số người phụ thuộc
                    'Eeduce' => $eeduce, //Tổng giảm trừ bản thân và người phụ thuộc
                    'Charity' => $charity, //Đóng góp từ thiện
                    'TotalReduce' => (int) $dependentTotal, //Tổng các khoản giảm trừ
                    'RentalIncome' => (int) $rentalIncome, //Thu nhập tính thuế
                    'PersonalIncomeTax' => (int) $personalIncomeTax, //Thuế TNCN
                    'SocialInsurancePayment' => $socialInsurancePayment, //Thanh toán từ BHXH
                    'Advance' => $advance, // tạm ứng
                    'ActuallyReceived' => (int) $actuallyReceived, // Net income - Lương thực nhận
                    'Note' => null, // ghi chú,
                    'SalaryByHour' => $salaryByHour,
                ];
            }
        }

        return true;
    }

    public function getFormular($attributes, $contract, $parameter = [])
    {
        $formular = null;
        foreach ($attributes as $item) {

            switch ($item->type) {
                case 'variable':
                    $valueVariable = $contract->parameterValues()->where('Code', $item->variable)->first();
                    $value = 0;

                    if (is_null($valueVariable)) {

                        $valueVariable = ParamaterValue::where('Code', $item->variable)->first();

                        if (is_null($valueVariable) && array_key_exists($item->variable, $parameter)) {
                            $value = !is_null($parameter[$item->variable]) ? $parameter[$item->variable] : 0;
                        } else {
                            $value = !is_null($valueVariable) ? $valueVariable->ValueDefault : 0;
                        }
                    } else {
                        $value = !is_null($valueVariable->pivot->Value) ? $valueVariable->pivot->Value : 0;
                    }

                    if (array_key_exists($item->variable, $parameter)) {
                        $value = !is_null($parameter[$item->variable]) ? $parameter[$item->variable] : 0;
                    }

                    if (!is_null($item->operator)) {
                        $formular .= $item->operator . $value;
                    } else {
                        $formular .= $value;
                    }
                    break;
                case 'value':
                    if (!is_null($item->operator)) {
                        $formular .= $item->operator . $item->value;
                    } else {
                        $formular .= $item->value;
                    }
                    break;
                case 'formular':
                    $value = $this->getFormular($item->formular, $contract, $parameter);
                    if (!is_null($item->operator)) {
                        $formular .= $item->operator . "(" . $value . ")";
                    } else {
                        $formular .= "(" . $value . ")";
                    }
                    break;
            }
        }

        return $formular;
    }

    public function calculateTax($rentalIncome, $fax)
    {
        $parameterTax = ParameterTax::where(function ($query) use ($rentalIncome) {
            $query->where('To', '<=', (int) $rentalIncome);
        })->orderBy('From')->get();

        $temp = 0;
        $valueFirst = 0;
        $valueEnd = 0;
        for ($i = 0; $i < count($parameterTax); $i++) {
            if ($i == 0) {
                $valueFirst = $parameterTax[$i]->To * ($parameterTax[$i]->Fax / 100);
            } else {
                $temp += ($parameterTax[$i]->To - $parameterTax[$i - 1]->To) * ($parameterTax[$i]->Fax / 100);
            }

            if ($i == count($parameterTax) - 1) {
                $valueEnd = ($rentalIncome - $parameterTax[$i]->To) * ($fax / 100);
            }
        }

        return $valueFirst + $temp + $valueEnd;
    }

    public function exportPayroll(array $attributes)
    {
        ini_set('max_execution_time', '300');
        $payroll = Payroll::where('Id', $attributes['id'])->with(['payrollDetail' => function ($query) use ($attributes) {
            $query->whereHas('employee', function ($q2) use ($attributes) {
                $q2->tranferHistory($attributes);

                if (!empty($attributes['fullName'])) {
                    $q2->whereLike('FullName', $attributes['fullName']);
                }

                if (!empty($attributes['employeeId'])) {
                    $employeeId = explode(',', $attributes['employeeId']);
                    $q2->whereIn('Id', $employeeId);
                }
            });
        }])->first();
        $params = [];
        $params['{month}'] = Carbon::parse($payroll->Month)->format('m.Y');
        $params['{start_time}'] = Carbon::parse($payroll->Month)->subMonth()->setDay(26)->format('d-m-Y');
        $params['{end_time}'] = Carbon::parse($payroll->Month)->setDay(25)->format('d-m-Y');
        $now = Carbon::now();
        $params['{date_sign}'] = $now->format('d');
        $params['{month_sign}'] = $now->format('m');
        $params['{year_sign}'] = $now->format('Y');


        $otherDeclaration = OtherDeclaration::where('Time', $payroll->Month)->first();
        $params['{number_of_work_days}'] = $otherDeclaration->NumberOfWorkdays;

        //mức lương trần bhxh
        $ceilingSalaryOfSocialInsurance = 0;
        $paramaterValueCeilingSalaryOfSocialInsurance = ParamaterValue::where('Code', 'MUC_LUONG_TRAN_BHXH')->first();
        if (!is_null($paramaterValueCeilingSalaryOfSocialInsurance)) {
            $ceilingSalaryOfSocialInsurance = $paramaterValueCeilingSalaryOfSocialInsurance->ValueDefault;
        }
        $params['{ceiling_salary_of_social_insurance}'] = number_format($ceilingSalaryOfSocialInsurance);

        //mức lương trần bhtn
        $unemploymentInsuranceCeilingSalary = 0;
        $paramaterValueUnemploymentInsuranceCeilingSalary = ParamaterValue::where('Code', 'MUC_LUONG_TRAN_BHXH')->first();
        if (!is_null($paramaterValueUnemploymentInsuranceCeilingSalary)) {
            $unemploymentInsuranceCeilingSalary = $paramaterValueUnemploymentInsuranceCeilingSalary->ValueDefault;
        }
        $params['{unemployment_insurance_ceiling_salary}'] = number_format($unemploymentInsuranceCeilingSalary);

        //giảm trừ bản thân
        $reduceYourself = 0;
        $paramaterValueReduceYourself = ParamaterValue::where('Code', 'GIAMTRU_BANTHAN')->first();
        if (!is_null($paramaterValueReduceYourself)) {
            $reduceYourself = $paramaterValueReduceYourself->ValueDefault;
        }
        $params['{reduce_yourself}'] = number_format($reduceYourself);

        //giảm trừ bản thân phụ thuộc
        $reduceDependentSelf = 0;
        $paramaterValueReduceDependentSelf = ParamaterValue::where('Code', 'GIAMTRU_PHUTHUOC')->first();
        if (!is_null($paramaterValueReduceDependentSelf)) {
            $reduceDependentSelf = $paramaterValueReduceDependentSelf->ValueDefault;
        }
        $params['{reduce_dependent_self}'] = number_format($reduceDependentSelf);

        //phụ cấp ăn trưa
        $lunchAllowance = 0;
        $paramaterValueLunchAllowance = ParamaterValue::where('Code', 'PC_AN_TRUA')->first();
        if (!is_null($paramaterValueLunchAllowance)) {
            $lunchAllowance = $paramaterValueLunchAllowance->ValueDefault;
        }
        $params['{lunch_allowance}'] = number_format($lunchAllowance);

        //lương cơ bản và phụ cấp
        $basicSalaryAllowance = [];
        $bsa = [];
        $totalBsa = [];
        foreach (json_decode($payroll->ColumnBasicSalaryAndAllowance) as $basicSalaryAllowanceValue) {
            $basicSalaryAllowance[] = $basicSalaryAllowanceValue->name;
            $bsa[] = "Lương cơ bản + Phụ Cấp";

            if (!array_key_exists($basicSalaryAllowanceValue->code, $totalBsa)) {
                $totalBsa[$basicSalaryAllowanceValue->code] = 0;
            }
        }

        $params['[[basic_salary_allowance]]'][] = $basicSalaryAllowance;
        $params['[[bsa]]'][] = $bsa;

        //phụ cấp phát sinh trong tháng
        $columnIncurredAllowance = [];
        $ai = [];
        $totalAi = [];
        if (!empty(json_decode($payroll->ColumnIncurredAllowance))) {

            foreach (json_decode($payroll->ColumnIncurredAllowance) as $columnIncurredAllowanceValue) {
                $columnIncurredAllowance[] = $columnIncurredAllowanceValue->name;
                $ai[] = "Phụ cấp phát sinh trong tháng";

                if (!array_key_exists($columnIncurredAllowanceValue->code, $totalAi)) {
                    $totalAi[$columnIncurredAllowanceValue->code] = 0;
                }
            }
        }

        $params['[[allowances_incurred]]'][] = $columnIncurredAllowance;
        $params['[[ai]]'][] = $ai;

        //param edit merge column
        $params['{from_to}'] = '';
        $params['{c_kpi_bonus}'] = '';
        $params['{c_ot}'] = '';
        $params['{c_ot_tax}'] = '';
        $params['{c_ot_no_tax}'] = '';
        $params['{c_unpaid_leave}'] = '';
        $params['{c_total_work}'] = '';
        $params['{c_total_income_month}'] = '';
        $params['{c_insurance_employee}'] = '';
        $params['{c_social_insurance_employee}'] = '';
        $params['{c_health_insurance_employee}'] = '';
        $params['{c_unemployment_insurance_employee}'] = '';
        $params['{c_social_insurance_adjusted_employee}'] = '';
        $params['{c_insurance_company}'] = '';
        $params['{c_social_insurance_company}'] = '';
        $params['{c_health_insurance_company}'] = '';
        $params['{c_unemployment_insurance_company}'] = '';
        $params['{c_social_insurance_adjusted_company}'] = '';
        $params['{c_union_dues}'] = '';
        $params['{c_tax_calculation_parameter}'] = '';
        $params['{c_dependent_person}'] = '';
        $params['{c_eeduce}'] = '';
        $params['{c_charity}'] = '';
        $params['{c_dependent_total}'] = '';
        $params['{c_rental_income}'] = '';
        $params['{c_personal_income_tax}'] = '';
        $params['{c_tax_free_payments}'] = '';
        $params['{c_social_insurance_payment}'] = '';
        $params['{c_advance}'] = '';
        $params['{c_actually_received}'] = '';
        $params['{c_note}'] = '';
        $params['{c_month_sign_commitment}'] = Carbon::parse($payroll->Month)->format('m');;
        $params['{c_probationary_note}'] = '';
        $params['{c_salary_hours}'] = '';
        $params['{c_merge_ot_empty}'] = '';
        $params['{c_over_time}'] = '';
        $params['{c_ot_tax_2}'] = '';
        $params['{c_ot_no_tax_2}'] = '';
        $params['{c_total_ot}'] = '';
        $params['{c_empty_1}'] = '';
        $params['{c_empty_2}'] = '';

        //data total
        $params['{total}'] = '';
        $params['{total_total_income}'] = 0;
        $params['{total_kpi_bonus}'] = 0;
        $params['{total_ot_tax}'] = 0;
        $params['{total_ot_no_tax}'] = 0;
        $params['{total_unpaid_leave}'] = 0;
        $params['{total_total_work}'] = 0;
        $params['{total_total_income_month}'] = 0;
        $params['{total_social_insurance_employee}'] = 0;
        $params['{total_health_insurance_employee}'] = 0;
        $params['{total_unemployment_insurance_employee}'] = 0;
        $params['{total_social_insurance_adjusted_employee}'] = 0;
        $params['{total_social_insurance_company}'] = 0;
        $params['{total_health_insurance_company}'] = 0;
        $params['{total_unemployment_insurance_company}'] = 0;
        $params['{total_social_insurance_adjusted_company}'] = 0;
        $params['{total_union_dues}'] = 0;
        $params['{total_dependent_person}'] = 0;
        $params['{total_eeduce}'] = 0;
        $params['{total_charity}'] = 0;
        $params['{total_dependent_total}'] = 0;
        $params['{total_rental_income}'] = 0;
        $params['{total_personal_income_tax}'] = 0;
        $params['{total_social_insurance_payment}'] = 0;
        $params['{total_advance}'] = 0;
        $params['{total_actually_received}'] = 0;
        $params['{total_note}'] = '';

        //data employee
        foreach ($payroll->payrollDetail as $key => $payrollDetail) {
            $basicSalaryAllowanceEmployee = json_decode($payrollDetail->BasicSalaryAndAllowance);
            $valueBasicSalaryAllowance = [];

            foreach ($basicSalaryAllowance as $value) {

                $keyBasicSalaryAllowance = array_search($value, array_column($basicSalaryAllowanceEmployee, 'name'));

                if ($keyBasicSalaryAllowance) {
                    $valueBasicSalaryAllowance[] = $basicSalaryAllowanceEmployee[$keyBasicSalaryAllowance]->value;

                    $totalBsa[$basicSalaryAllowanceEmployee[$keyBasicSalaryAllowance]->code] += $basicSalaryAllowanceEmployee[$keyBasicSalaryAllowance]->value;
                } else {
                    $valueBasicSalaryAllowance[] = 0;
                };
            }

            $incurredAllowanceEmployee = json_decode($payrollDetail->IncurredAllowance);
            $valueIncurredAllowance = [];
            foreach ($columnIncurredAllowance as $value) {
                $keyColumnIncurredAllowance = array_search($value, array_column($incurredAllowanceEmployee, 'name'));

                if ($keyColumnIncurredAllowance) {
                    $valueIncurredAllowance[] = $incurredAllowanceEmployee[$keyColumnIncurredAllowance]->value;

                    $totalAi[$incurredAllowanceEmployee[$keyColumnIncurredAllowance]->code] += $incurredAllowanceEmployee[$keyColumnIncurredAllowance]->value;
                } else {
                    $valueIncurredAllowance[] = 0;
                };
            }

            $otWeekday = !is_null($payrollDetail->OtWeekday) ? $payrollDetail->OtWeekday : 0;
            $otWeekend = !is_null($payrollDetail->OtWeekend) ? $payrollDetail->OtWeekend : 0;
            $otHoliday = !is_null($payrollDetail->OtHoliday) ? $payrollDetail->OtHoliday : 0;

            //total
            $params['{total_total_income}'] += $payrollDetail->TotalIncome;
            // $params['{total_kpi_bonus}'] += $payrollDetail->KpiBonus;
            $params['{total_ot_tax}'] += $payrollDetail->OtTax;
            $params['{total_ot_no_tax}'] += $payrollDetail->OtNoTax;
            // $params['{total_unpaid_leave}'] += $payrollDetail->UnpaidLeave;
            $params['{total_total_work}'] += $payrollDetail->TotalWork;
            $params['{total_total_income_month}'] += $payrollDetail->TotalIncomeMonth;
            $params['{total_social_insurance_employee}'] += $payrollDetail->SocialInsuranceEmployee;
            $params['{total_health_insurance_employee}'] += $payrollDetail->HealthInsuranceEmployee;
            $params['{total_unemployment_insurance_employee}'] += $payrollDetail->UnemploymentInsuranceEmployee;
            $params['{total_social_insurance_adjusted_employee}'] += $payrollDetail->SocialInsuranceAdjustedEmployee;
            $params['{total_social_insurance_company}'] += $payrollDetail->SocialInsuranceCompany;
            $params['{total_health_insurance_company}'] += $payrollDetail->HealthInsuranceCompany;
            $params['{total_unemployment_insurance_company}'] += $payrollDetail->UnemploymentInsuranceCompany;
            $params['{total_social_insurance_adjusted_company}'] += $payrollDetail->SocialInsuranceAdjustedCompany;
            $params['{total_union_dues}'] += $payrollDetail->UnionDues;
            $params['{total_dependent_person}'] += $payrollDetail->DependentPerson;
            $params['{total_eeduce}'] += $payrollDetail->Eeduce;
            $params['{total_charity}'] += $payrollDetail->Charity;
            $params['{total_dependent_total}'] += $payrollDetail->TotalReduce;
            $params['{total_rental_income}'] += $payrollDetail->RentalIncome;
            $params['{total_personal_income_tax}'] += $payrollDetail->PersonalIncomeTax;
            $params['{total_social_insurance_payment}'] += $payrollDetail->SocialInsurancePayment;
            $params['{total_advance}'] += $payrollDetail->Advance;
            $params['{total_actually_received}'] += $payrollDetail->ActuallyReceived;

            $params['[number]'][] = ++$key;
            $params['[employee_code]'][] = $payrollDetail->employee->Code;
            $params['[full_name]'][] = $payrollDetail->employee->FullName;
            $params['[date_start_work]'][] = $payrollDetail->employee->WorkDate;
            $params['[probation]'][] = $payrollDetail->IsProbation ? 'Có' : '';
            $params['[maternity]'][] = $payrollDetail->IsMaternity ? 'Có' : '';
            $params['[is_social_insurance]'][] = $payrollDetail->IsSocialInsurance ? 'Có' : '';
            $params['[total_income]'][] = number_format($payrollDetail->TotalIncome);
            $params['[[value_basic_salary_allowance]]'][] = $valueBasicSalaryAllowance;
            $params['[[value_allowances incurred]]'][] = $valueIncurredAllowance;
            $params['[kpi_bonus]'][] = !is_null($payrollDetail->KpiBonus) ? number_format($payrollDetail->KpiBonus) : 0;
            $params['[ot_tax]'][] = number_format($payrollDetail->OtTax);
            $params['[ot_no_tax]'][] = number_format($payrollDetail->OtNoTax);
            $params['[unpaid_leave]'][] = !is_null($payrollDetail->UnpaidLeave) ? number_format($payrollDetail->UnpaidLeave) : 0;
            $params['[total_work]'][] = number_format($payrollDetail->TotalWork);
            $params['[total_income_month]'][] = number_format($payrollDetail->TotalIncomeMonth);
            $params['[social_insurance_employee]'][] = number_format($payrollDetail->SocialInsuranceEmployee);
            $params['[health_insurance_employee]'][] = number_format($payrollDetail->HealthInsuranceEmployee);
            $params['[unemployment_insurance_employee]'][] = number_format($payrollDetail->UnemploymentInsuranceEmployee);
            $params['[social_insurance_adjusted_employee]'][] = number_format($payrollDetail->SocialInsuranceAdjustedEmployee);
            $params['[social_insurance_company]'][] = number_format($payrollDetail->SocialInsuranceCompany);
            $params['[health_insurance_company]'][] = number_format($payrollDetail->HealthInsuranceCompany);
            $params['[unemployment_insurance_company]'][] = number_format($payrollDetail->UnemploymentInsuranceCompany);
            $params['[social_insurance_adjusted_company]'][] = number_format($payrollDetail->SocialInsuranceAdjustedCompany);
            $params['[union_dues]'][] = number_format($payrollDetail->UnionDues);
            $params['[dependent_person]'][] = number_format($payrollDetail->DependentPerson);
            $params['[eeduce]'][] = number_format($payrollDetail->Eeduce);
            $params['[charity]'][] = number_format($payrollDetail->Charity);
            $params['[dependent_total]'][] = number_format($payrollDetail->TotalReduce);
            $params['[rental_income]'][] = number_format($payrollDetail->RentalIncome);
            $params['[personal_income_tax]'][] = number_format($payrollDetail->PersonalIncomeTax);
            $params['[social_insurance_payment]'][] = number_format($payrollDetail->SocialInsurancePayment);
            $params['[advance]'][] = number_format($payrollDetail->Advance);
            $params['[actually_received]'][] = number_format($payrollDetail->ActuallyReceived);
            $params['[note]'][] = $payrollDetail->Note;
            $params['[sign_commitment]'][] = "-";
            $params['[probationary_period]'][] = "-";
            $params['[salary_hours]'][] = number_format($payrollDetail->SalaryByHour);
            $params['[ot_weekday]'][] = $otWeekday;
            $params['[ot_weekend]'][] = $otWeekend;
            $params['[ot_holiday]'][] = $otHoliday;
            $params['[total_hour_ot]'][] = $otWeekday + $otWeekend + $otHoliday;
            $params['[total_ot]'][] = number_format($payrollDetail->OtTax + $payrollDetail->OtNoTax);
            $params['[empty_1]'][] = "";
            $params['[empty_2]'][] = "";
        }

        $params['[[total_value_basic_salary_allowance]]'][] = array_values($totalBsa);
        $params['[[total_value_allowances_incurred]]'][] = array_values($totalAi);

        $endColumnBasicSalaryAllowance = null;
        $listMerge = [];
        $callbacks = [
            '{month}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $columnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($currentColumn);
                $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($columnIndex + 2);
                $merge = $cell_coordinate . ":" . $adjustedColumn . $currentRow;
                $listMerge[] = $merge;
            },
            '{from_to}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $columnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($currentColumn);
                $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($columnIndex + 2);
                $merge = $cell_coordinate . ":" . $adjustedColumn . $currentRow;
                $listMerge[] = $merge;
            },
            '{date_sign}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $columnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($currentColumn);
                $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($columnIndex + 2);
                $merge = $cell_coordinate . ":" . $adjustedColumn . $currentRow;
                $listMerge[] = $merge;
            },
            '[[bsa]]' => function (CallbackParam $param) use (&$listMerge, &$endColumnBasicSalaryAllowance) {
                $row_index = $param->row_index;
                $col_index = $param->col_index;
                $cell_coordinate = $param->coordinate;
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $mergeCoordinate[] = $cell_coordinate;
                $firstValue = $param->param[$row_index][0];

                if ($col_index == 0) {
                    $columnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($currentColumn);
                    for ($i = 0; $i < count($param->param[$row_index]); $i++) {
                        $adjustedColumnIndex = $columnIndex + $i;
                        if ($param->param[$row_index][$i] != $firstValue) {

                            $adjustedColumnBefor = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($adjustedColumnIndex - 1);
                            $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($adjustedColumnIndex);

                            $mergeCoordinate[] = $adjustedColumnBefor . $currentRow;
                            $mergeCoordinate[] = $adjustedColumn . $currentRow;
                            $firstValue = $param->param[$row_index][$i];
                        }

                        if ($i == count($param->param[$row_index]) - 1) {
                            $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($adjustedColumnIndex);
                            $adjustedColumnAfter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($adjustedColumnIndex + 1);
                            $endColumnBasicSalaryAllowance = $adjustedColumnAfter;
                            $mergeCoordinate[] = $adjustedColumn . $currentRow;
                        }
                    }
                }

                foreach ($mergeCoordinate as $key => $coordinate) {
                    if ($key % 2 != 0) {
                        $merge = $mergeCoordinate[$key - 1] . ":" . $mergeCoordinate[$key];
                        $listMerge[] = $merge;
                    }
                }
            },
            '[[basic_salary_allowance]]' => function (CallbackParam $param) use (&$listMerge) {
                $row_index = $param->row_index;
                $col_index = $param->col_index;
                $cell_coordinate = $param->coordinate;
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $mergeCoordinate[] = $cell_coordinate;
                $firstValue = $param->param[$row_index][0];

                $nextRow = (int)$currentRow + 1;
                $merge = $cell_coordinate . ":" . $currentColumn . $nextRow;
                $listMerge[] = $merge;
            },
            '[[ai]]' => function (CallbackParam $param) use (&$listMerge) {
                $sheet = $param->sheet;
                $row_index = $param->row_index;
                $col_index = $param->col_index;
                $cell_coordinate = $param->coordinate;
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $mergeCoordinate[] = $cell_coordinate;
                $firstValue = $param->param[$row_index][0];

                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('c5e0b3');

                if ($col_index == 0) {
                    $columnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($currentColumn);
                    for ($i = 0; $i < count($param->param[$row_index]); $i++) {
                        $adjustedColumnIndex = $columnIndex + $i;
                        if ($param->param[$row_index][$i] != $firstValue) {

                            $adjustedColumnBefor = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($adjustedColumnIndex - 1);
                            $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($adjustedColumnIndex);

                            $mergeCoordinate[] = $adjustedColumnBefor . $currentRow;
                            $mergeCoordinate[] = $adjustedColumn . $currentRow;
                            $firstValue = $param->param[$row_index][$i];
                        }

                        if ($i == count($param->param[$row_index]) - 1) {
                            $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($adjustedColumnIndex);
                            $mergeCoordinate[] = $adjustedColumn . $currentRow;
                        }
                    }
                }

                foreach ($mergeCoordinate as $key => $coordinate) {
                    if ($key % 2 != 0) {
                        $merge = $mergeCoordinate[$key - 1] . ":" . $mergeCoordinate[$key];
                        $listMerge[] = $merge;
                    }
                }
            },
            '[[allowances_incurred]]' => function (CallbackParam $param) use (&$listMerge) {
                $row_index = $param->row_index;
                $col_index = $param->col_index;
                $cell_coordinate = $param->coordinate;
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $mergeCoordinate[] = $cell_coordinate;
                $firstValue = $param->param[$row_index][0];

                $nextRow = (int)$currentRow + 1;
                $merge = $cell_coordinate . ":" . $currentColumn . $nextRow;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('c5e0b3');
            },
            '{c_kpi_bonus}' => function (CallbackParam $param) use (&$listMerge) {
                $sheet = $param->sheet;
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 2;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('fee598');
                $sheet->getStyle($cell_coordinate)->getFont()->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('f8191a'));
            },
            '{c_ot}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $columnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($currentColumn);
                $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($columnIndex + 1);
                $merge = $cell_coordinate . ":" . $adjustedColumn . $currentRow;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
            },
            '{c_ot_tax}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
            },
            '{c_ot_no_tax}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
            },
            '{c_unpaid_leave}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 2;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
                $sheet->getStyle($cell_coordinate)->getFont()->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('1465cc'));
            },
            '{c_total_work}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 2;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
                $sheet->getStyle($cell_coordinate)->getFont()->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('1465cc'));
            },
            '{c_total_income_month}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 2;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
                $sheet->getStyle($cell_coordinate)->getFont()->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('1465cc'));
            },
            '{c_insurance_employee}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $columnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($currentColumn);
                $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($columnIndex + 3);
                $merge = $cell_coordinate . ":" . $adjustedColumn . $currentRow;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('bdd6ee');
            },
            '{c_social_insurance_employee}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('bdd6ee');
            },
            '{c_health_insurance_employee}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('bdd6ee');
            },
            '{c_unemployment_insurance_employee}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('bdd6ee');
            },
            '{c_social_insurance_adjusted_employee}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('bdd6ee');
            },
            '{c_insurance_company}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $columnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($currentColumn);
                $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($columnIndex + 4);
                $merge = $cell_coordinate . ":" . $adjustedColumn . $currentRow;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{c_social_insurance_company}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{c_health_insurance_company}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{c_unemployment_insurance_company}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{c_social_insurance_adjusted_company}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{c_union_dues}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{c_tax_calculation_parameter}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $columnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($currentColumn);
                $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($columnIndex + 2);
                $merge = $cell_coordinate . ":" . $adjustedColumn . $currentRow;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{c_dependent_person}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{c_eeduce}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{c_charity}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{c_dependent_total}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 2;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{c_rental_income}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 2;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{c_personal_income_tax}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 2;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{c_tax_free_payments}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $columnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($currentColumn);
                $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($columnIndex + 1);
                $merge = $cell_coordinate . ":" . $adjustedColumn . $currentRow;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('fef2cb');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{c_social_insurance_payment}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('fef2cb');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{c_advance}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('fef2cb');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
                $sheet->getStyle($cell_coordinate)->getFont()->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('f8191a'));
            },
            '{c_actually_received}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 2;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
                $sheet->getStyle($cell_coordinate)->getFont()->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('1465cc'));
            },
            '{c_note}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 2;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('ccfecc');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{c_empty_1}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 2;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getBorders()->getOutline()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_NONE);
            },
            '{c_empty_2}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 2;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getBorders()->getOutline()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_NONE);
            },
            '{c_month_sign_commitment}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 2;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
            },
            '{c_probationary_note}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 2;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
            },
            '{c_salary_hours}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 2;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{c_merge_ot_empty}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $columnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($currentColumn);
                $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($columnIndex + 6);
                $merge = $cell_coordinate . ":" . $adjustedColumn . $currentRow;
                $listMerge[] = $merge;
            },
            '{c_over_time}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $columnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($currentColumn);
                $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($columnIndex + 3);
                $merge = $cell_coordinate . ":" . $adjustedColumn . $currentRow;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('deeaf6');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);

                $nextRow = $currentRow + 1;
                $a = [];
                for ($i = 0; $i < 4; $i++) {
                    $adjustedColumnIndex = $columnIndex + $i;
                    $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($adjustedColumnIndex);
                    $a[] = $adjustedColumn . $nextRow;
                }

                foreach ($a as $key => $value) {
                    $sheet->getStyle($value)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                        ->setARGB('deeaf6');
                    $sheet->getStyle($value)->getFont()->setBold(true);
                    switch ($key) {
                        case 0:
                            $sheet->getCell($value)->setValue("Hrs 150%- ngày thường");
                            break;
                        case 1:
                            $sheet->getCell($value)->setValue("Hrs 200%- cuối tuần");
                            break;
                        case 2:
                            $sheet->getCell($value)->setValue("Hrs 300%- ngày lễ");
                            break;
                        case 3:
                            $sheet->getCell($value)->setValue("Total OT\n(Hrs)");
                            $sheet->getStyle($value)->getFont()->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('1d83e2'));
                            break;
                    }
                }
            },
            '{c_ot_tax_2}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('deeaf6');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{c_ot_no_tax_2}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('deeaf6');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
                $sheet->getStyle($cell_coordinate)->getFont()->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('1f8357'));
            },
            '{c_total_ot}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('deeaf6');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $columnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($currentColumn);
                $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($columnIndex + 2);
                $merge = $cell_coordinate . ":" . $adjustedColumn . $currentRow;
                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_total_income}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '[[total_value_basic_salary_allowance]]' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '[[total_value_allowances_incurred]]' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_kpi_bonus}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_ot_tax}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_ot_no_tax}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_unpaid_leave}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_total_work}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_total_income_month}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_social_insurance_employee}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_health_insurance_employee}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_unemployment_insurance_employee}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_social_insurance_adjusted_employee}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_social_insurance_company}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_health_insurance_company}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_unemployment_insurance_company}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_social_insurance_adjusted_company}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_union_dues}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_dependent_person}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_eeduce}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_charity}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_dependent_total}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_rental_income}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_personal_income_tax}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_social_insurance_payment}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_advance}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_actually_received}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '{total_note}' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('dadada');
                $sheet->getStyle($cell_coordinate)->getFont()->setBold(true);
            },
            '[empty_1]' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getBorders()->getOutline()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_NONE);
            },
            '[empty_2]' => function (CallbackParam $param) {
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $sheet = $param->sheet;
                $sheet->getStyle($cell_coordinate)->getBorders()->getOutline()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_NONE);
            },
        ];

        $events = [
            PhpExcelTemplator::AFTER_INSERT_PARAMS => function (Worksheet $sheet, array $templateVarsArr) use (&$listMerge, &$endColumnBasicSalaryAllowance, $columnIncurredAllowance) {
                foreach ($listMerge as $item) {
                    $sheet->mergeCells($item);
                }

                if (empty($columnIncurredAllowance)) {
                    $sheet->removeColumn($endColumnBasicSalaryAllowance);
                }
            },

        ];

        return $this->excelExporterServices->export('salary_month', $params, $callbacks, $events);
    }
}
