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
                $employee = $this->calculatorSalary($payroll, $employee, $dataInsert, $startDate, $endDate, $numberOfWorkdays, $otherDeclaration, $columnBasicSalaryAndAllowance, $columnIncurredAllowance);
            }

            $payroll->payrollDetail()->delete();
            PayRollDetail::insert($dataInsert);

            $payroll->update([
                'columnBasicSalaryAndAllowance' => json_encode(array_values($columnBasicSalaryAndAllowance)),
                'columnIncurredAllowance' => json_encode(array_values($columnIncurredAllowance)),
            ]);

            $payroll->update(['IsSalary' => true]);
        }

        return parent::find($attributes['id']);
    }

    public function calculatorSalary($payroll, $employee, &$dataInsert, $startDate, $endDate, $numberOfWorkdays, $otherDeclaration, &$columnBasicSalaryAndAllowance, &$columnIncurredAllowance)
    {
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

        if (!is_null($otherDeclarationDetail)) {
            $isMaternity = true;
        }

        if (!is_null($otherDeclarationDetail)) {
            if (!is_null($otherDeclarationDetail->Detail)) {
                $incurredAllowance = json_decode($otherDeclarationDetail->Detail);

                foreach ($incurredAllowance as $itemIncurredAllowance) {
                    if ($itemIncurredAllowance->code === 'DIEU_CHINH_BHXH_NLD') {
                        $parameter['DIEU_CHINH_BHXH_NLD'] = $itemIncurredAllowance->value;
                        $socialInsuranceAdjustedEmployee = $itemIncurredAllowance->value;
                    } elseif ($itemIncurredAllowance->code === 'DIEU_CHINH_BHXH_CTT') {
                        $parameter['DIEU_CHINH_BHXH_CTT'] = $itemIncurredAllowance->value;
                        $socialInsuranceAdjustedCompany = $itemIncurredAllowance->value;
                    } elseif ($itemIncurredAllowance->code === 'DONG_GOP_TU_THIEN') {
                        $parameter['DONG_GOP_TU_THIEN'] = $itemIncurredAllowance->value;
                        $charity = $itemIncurredAllowance->value;
                    } elseif ($itemIncurredAllowance->code === 'THANH_TOAN_TU_BHXH') {
                        $parameter['THANH_TOAN_TU_BHXH'] = $itemIncurredAllowance->value;
                        $socialInsurancePayment = $itemIncurredAllowance->value;
                    } elseif ($itemIncurredAllowance->code === 'SO_TIEN_TAM_UNG') {
                        $parameter['SO_TIEN_TAM_UNG'] = $itemIncurredAllowance->value;
                        $advance = $itemIncurredAllowance->value;
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

        $contract = $employee->labourContract()->orderBy('CreationTime')->first();

        if (is_null($contract)) {
            $contract = $employee->probationaryContract()->orderBy('CreationTime')->first();
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
            $formularSalaryByHour = ParamaterFormula::where('Code', 'LUONG_THEO_GIO')->first();
            $salaryByHour = $this->getFormular(json_decode($formularSalaryByHour->Recipe), $contract, $parameter);
            $salaryByHour = eval('return ' . $salaryByHour . ';');
            $parameter['LUONG_THEO_GIO'] = $salaryByHour;

            // Lương làm thêm không tính thuế
            $formularTotalOtNoFax = ParamaterFormula::where('Code', 'OT_KHONG_TINH_THUE')->first();
            $totalOtNoFax = $this->getFormular(json_decode($formularTotalOtNoFax->Recipe), $contract, $parameter);
            $totalOtNoFax = eval('return ' . $totalOtNoFax . ';');
            $parameter['OT_KHONG_TINH_THUE'] = $totalOtNoFax;

            //Tổng lương làm thêm
            $formularTotalOt = ParamaterFormula::where('Code', 'TOTAL_OT')->first();
            $totalOt = $this->getFormular(json_decode($formularTotalOt->Recipe), $contract, $parameter);
            $totalOt = eval('return ' . $totalOt . ';');
            $parameter['TOTAL_OT'] = $totalOt;

            // Lương làm thêm tính thuế
            $formularTotalOtFax = ParamaterFormula::where('Code', 'OT_TINH_THUE')->first();
            $totalOtFax = $this->getFormular(json_decode($formularTotalOtFax->Recipe), $contract, $parameter);
            $totalOtFax = eval('return ' . $totalOtFax . ';');
            $parameter['OT_TINH_THUE'] = $totalOtFax;

            //bhxh nld
            $formularSocialInsuranceEmployee = ParamaterFormula::where('Code', 'BHXH_NLD')->first();
            $socialInsuranceEmployee = $this->getFormular(json_decode($formularSocialInsuranceEmployee->Recipe), $contract, $parameter);
            $socialInsuranceEmployee = eval('return ' . $socialInsuranceEmployee . ';');
            $parameter['BHXH_NLD'] = $socialInsuranceEmployee;

            //bhyt nld
            $formularHealthInsuranceEmployee = ParamaterFormula::where('Code', 'BHYT_NLD')->first();
            $healthInsuranceEmployee = $this->getFormular(json_decode($formularHealthInsuranceEmployee->Recipe), $contract, $parameter);
            $healthInsuranceEmployee = eval('return ' . $healthInsuranceEmployee . ';');
            $parameter['BHYT_NLD'] = $healthInsuranceEmployee;

            //bhtn nld
            $formularUnemploymentInsuranceEmployee = ParamaterFormula::where('Code', 'BHTN_NLD')->first();
            $unemploymentInsuranceEmployee = $this->getFormular(json_decode($formularUnemploymentInsuranceEmployee->Recipe), $contract, $parameter);
            $unemploymentInsuranceEmployee = eval('return ' . $unemploymentInsuranceEmployee . ';');
            $parameter['BHTN_NLD'] = $unemploymentInsuranceEmployee;

            //Tổng bh nld
            $formularTotalEmployeeInsurance = ParamaterFormula::where('Code', 'TONG_BH_NLD')->first();
            $totalEmployeeInsurance = $this->getFormular(json_decode($formularTotalEmployeeInsurance->Recipe), $contract, $parameter);
            $totalEmployeeInsurance = eval('return ' . $totalEmployeeInsurance . ';');
            $parameter['TONG_BH_NLD'] = $totalEmployeeInsurance;

            //bhxh cty
            $formularSocialInsuranceCompany = ParamaterFormula::where('Code', 'BHXH_CTT')->first();
            $socialInsuranceCompany = $this->getFormular(json_decode($formularSocialInsuranceCompany->Recipe), $contract, $parameter);
            $socialInsuranceCompany = eval('return ' . $socialInsuranceCompany . ';');
            $parameter['BHXH_CTT'] = $socialInsuranceCompany;

            //bhyt cty
            $formularHealthInsuranceCompany = ParamaterFormula::where('Code', 'BHYT_CTT')->first();
            $healthInsuranceCompany = $this->getFormular(json_decode($formularHealthInsuranceCompany->Recipe), $contract, $parameter);
            $healthInsuranceCompany = eval('return ' . $healthInsuranceCompany . ';');
            $parameter['BHYT_CTT'] = $healthInsuranceCompany;

            //bhtn cty
            $formularUnemploymentInsuranceCompany = ParamaterFormula::where('Code', 'BHTN_CTT')->first();
            $unemploymentInsuranceCompany = $this->getFormular(json_decode($formularUnemploymentInsuranceCompany->Recipe), $contract, $parameter);
            $unemploymentInsuranceCompany = eval('return ' . $unemploymentInsuranceCompany . ';');
            $parameter['BHTN_CTT'] = $unemploymentInsuranceCompany;

            //Tổng bh cty
            $formularTotalCompanyInsurance = ParamaterFormula::where('Code', 'TONG_BH_CTT')->first();
            $totalCompanyInsurance = $this->getFormular(json_decode($formularTotalCompanyInsurance->Recipe), $contract, $parameter);
            $totalCompanyInsurance = eval('return ' . $totalCompanyInsurance . ';');
            $parameter['TONG_BH_CTT'] = $totalCompanyInsurance;

            // phụ cấp xe bus
            $formularBusAllowance = ParamaterFormula::where('Code', 'PC_BUS')->first();
            $busAllowance = $this->getFormular(json_decode($formularBusAllowance->Recipe), $contract, $parameter);
            $busAllowance = eval('return ' . $busAllowance . ';');
            $parameter['PC_BUS'] = $busAllowance;

            //tổng phụ cấp
            $formularTotalAllowance = ParamaterFormula::where('Code', 'TONG_PC')->first();
            $totalAllowance = $this->getFormular(json_decode($formularTotalAllowance->Recipe), $contract, $parameter);
            $totalAllowance = eval('return ' . $totalAllowance . ';');
            $parameter['TONG_PC'] = $totalAllowance;

            //tổng thu nhập
            $formularTotalIncome = ParamaterFormula::where('Code', 'TONG_THUNHAP_NV_CHINH_THUC')->first();

            if ($isProbation) {
                $formularTotalIncome = ParamaterFormula::where('Code', 'TONG_THUNHAP_NV_THU_VIEC')->first();
            }

            $totalIncome = $this->getFormular(json_decode($formularTotalIncome->Recipe), $contract, $parameter);
            $totalIncome = eval('return ' . $totalIncome . ';');
            $parameter['TONG_THUNHAP'] = $totalIncome;

            //Tổng các khoản đc miễn thế
            $formularTotalTaxFree = ParamaterFormula::where('Code', 'TONG_MIENTHUE')->first();
            $totalTaxFree = $this->getFormular(json_decode($formularTotalTaxFree->Recipe), $contract, $parameter);
            $totalTaxFree = eval('return ' . $totalTaxFree . ';');
            $parameter['TONG_MIENTHUE'] = $totalTaxFree;

            //thu nhập chịu thuế
            $formularIncomeTaxes = ParamaterFormula::where('Code', 'THUNHAP_CHIUTHUE')->first();
            $incomeTaxes = $this->getFormular(json_decode($formularIncomeTaxes->Recipe), $contract, $parameter);
            $incomeTaxes = eval('return ' . $incomeTaxes . ';');
            $parameter['THUNHAP_CHIUTHUE'] = $incomeTaxes;

            //tổng giảm trừ
            $formularDependentTotal = ParamaterFormula::where('Code', 'TONG_GIAMTRU')->first();
            $dependentTotal = $this->getFormular(json_decode($formularDependentTotal->Recipe), $contract, $parameter);
            $dependentTotal = eval('return ' . $dependentTotal . ';');
            $parameter['TONG_GIAMTRU'] = $dependentTotal;

            // thu nhập tính thuế
            $formularRentalIncome = ParamaterFormula::where('Code', 'THUNHAP_TINHTHUE')->first();
            $rentalIncome = $this->getFormular(json_decode($formularRentalIncome->Recipe), $contract, $parameter);
            $rentalIncome = eval('return ' . $rentalIncome . ';');
            $rentalIncome = $rentalIncome > 0 ? $rentalIncome : 0;
            $parameter['THUNHAP_TINHTHUE'] = $rentalIncome;

            //phí công đoàn
            $formularUnionDues = ParamaterFormula::where('Code', 'PHI_CONG_DOAN')->first();
            $unionDues = $this->getFormular(json_decode($formularUnionDues->Recipe), $contract, $parameter);
            $unionDues = eval('return ' . $unionDues . ';');
            $parameter['PHI_CONG_DOAN'] = $unionDues;


            //tổng thu nhập trong tháng
            $formularTotalIncomeMonth = ParamaterFormula::where('Code', 'TONG_THUNHAP_TRONG_THANG')->first();
            $totalIncomeMonth = $this->getFormular(json_decode($formularTotalIncomeMonth->Recipe), $contract, $parameter);
            $totalIncomeMonth = eval('return ' . $totalIncomeMonth . ';');
            $parameter['TONG_THUNHAP_TRONG_THANG'] = $totalIncomeMonth;




            // tổng giảm trừ bản thân và người phụ thuộc
            $formularDependentPerson = ParamaterFormula::where('Code', 'GIAM_TRU_BAN_THAN_PHU_THUOC')->first();
            $eeduce = $this->getFormular(json_decode($formularDependentPerson->Recipe), $contract, $parameter);
            $eeduce = eval('return ' . $eeduce . ';');
            $parameter['GIAM_TRU_BAN_THAN_PHU_THUOC'] = $eeduce;




            // thuế tncn
            $personalIncomeTax = 0; // chưa làm
            // if ($rentalIncome > 0) {
            //     $tax = ParameterTax::where(function ($query) use ($rentalIncome) {
            //         $query->where([['From', '<=', (int) $rentalIncome], ['To', '>=', (int) $rentalIncome]])
            //             ->orWhere([['From', '<=', (int) $rentalIncome], ['To', null]]);
            //     })->first();

            //     if (!is_null($tax)) {
            //         switch ($tax->Code) {
            //             case 'CAP_1':
            //                 $personalIncomeTax = $rentalIncome * ($tax->Fax / 100);

            //                 break;
            //             case 'CAP_2':
            //                 # code...
            //                 break;
            //             case 'CAP_3':
            //                 # code...
            //                 break;
            //             case 'CAP_4':
            //                 # code...
            //                 break;
            //             case 'CAP_5':
            //                 # code...
            //                 break;
            //             case 'CAP_6':
            //                 # code...
            //                 break;
            //             case 'CAP_7':
            //                 # code...
            //                 break;
            //         }
            //     }
            //     dd($tax);
            // }

            $parameter['THUE_TNCN'] = $personalIncomeTax;

            //lương thực nhận
            $formularActuallyReceived = ParamaterFormula::where('Code', 'LUONG_THUC_NHAN')->first();
            $actuallyReceived = $this->getFormular(json_decode($formularActuallyReceived->Recipe), $contract, $parameter);
            $actuallyReceived = eval('return ' . $actuallyReceived . ';');
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
            ];
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
                            $value = $parameter[$item->variable];
                        } else {
                            $value = !is_null($valueVariable) ? $valueVariable->ValueDefault : 0;
                        }
                    } else {
                        $value = $valueVariable->pivot->Value;
                    }

                    if (array_key_exists($item->variable, $parameter)) {
                        $value = $parameter[$item->variable];
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
}
