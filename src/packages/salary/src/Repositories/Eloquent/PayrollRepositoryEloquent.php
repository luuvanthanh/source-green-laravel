<?php

namespace GGPHP\Salary\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\BusRegistration\Repositories\Eloquent\BusRegistrationRepositoryEloquent;
use GGPHP\Category\Models\ParamaterFormula;
use GGPHP\Category\Models\ParamaterValue;
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
        $payroll = Payroll::where('Month', $attributes['month'])->first();

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

        }

        return parent::find($attributes['id']);

    }

    public function calculatorSalary($payroll, $employee, &$dataInsert, $startDate, $endDate, $numberOfWorkdays, $otherDeclaration, &$columnBasicSalaryAndAllowance, &$columnIncurredAllowance)
    {
        $totalWorks = $this->timekeepingRepositoryEloquent->calculatorTimekeepingReport($employee, [
            'startDate' => $startDate,
            'endDate' => $endDate,
        ])->totalWorks;
        $otherDeclarationDetail = $otherDeclaration->otherDeclarationDetail->where('EmployeeId', $employee->Id)->first();

        $incurredAllowance = json_encode([]);

        if (!is_null($otherDeclarationDetail)) {
            $incurredAllowance = $otherDeclarationDetail->Detail;

            foreach (json_decode($incurredAllowance) as $itemIncurredAllowance) {

                if (!array_key_exists($itemIncurredAllowance->code, $columnIncurredAllowance)) {
                    $columnIncurredAllowance[$itemIncurredAllowance->code] = [
                        'code' => $itemIncurredAllowance->code,
                        'name' => $itemIncurredAllowance->name,
                    ];
                }
            }
        }

        $totalBusRegistration = $this->busRegistrationRepositoryEloquent->calculatorBusRegistrationReport($employee, [
            'startDate' => $startDate,
            'endDate' => $endDate,
        ])->totalBusRegistration;

        $contract = $employee->labourContract()->orderBy('CreationTime')->first();

        if (is_null($contract)) {
            $contract = $employee->probationaryContract()->orderBy('CreationTime')->first();

        }

        if (!is_null($contract) && $totalWorks > 0) {
            $parameterValues = $contract->parameterValues;
            $parameter = [];

            $parameter['SO_NGAY_CHUAN'] = (int) $numberOfWorkdays;
            $parameter['SO_GIO_DI_XE_BUS'] = $totalBusRegistration;
            $parameter['SO_NGAY_LAM_VIEC_TRONG_THANG'] = $totalWorks;
            $parameter['DIEU_CHINH_BHXH_NLD'] = 0; // chua làm

            //tổng thu nhập
            $formularTotalIncome = ParamaterFormula::where('Code', 'TONG_THU_NHAP')->first();
            $totalIncome = $this->getFormular(json_decode($formularTotalIncome->Recipe), $contract, $parameter);
            $totalIncome = eval('return ' . $totalIncome . ';');
            $parameter['TONG_THU_NHAP'] = $totalIncome;

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

            //Tổng lương làm thêm
            $formularTotalOt = ParamaterFormula::where('Code', 'TOTAL_OT')->first();
            $totalOt = $this->getFormular(json_decode($formularTotalOt->Recipe), $contract, $parameter);
            $totalOt = eval('return ' . $totalOt . ';');
            $parameter['TOTAL_OT'] = $totalOt;

            // Lương làm thêm không tính thuế
            $formularTotalOtNoFax = ParamaterFormula::where('Code', 'OT_KHONG_TINH_THUE')->first();
            $totalOtNoFax = $this->getFormular(json_decode($formularTotalOtNoFax->Recipe), $contract, $parameter);
            $totalOtNoFax = eval('return ' . $totalOtNoFax . ';');
            $parameter['OT_KHONG_TINH_THUE'] = $totalOtNoFax;

            // Lương làm thêm tính thuế
            $formularTotalOtFax = ParamaterFormula::where('Code', 'OT_TINH_THUE')->first();
            $totalOtFax = $this->getFormular(json_decode($formularTotalOtFax->Recipe), $contract, $parameter);
            $totalOtFax = eval('return ' . $totalOtFax . ';');
            $parameter['OT_TINH_THUE'] = $totalOtFax;

            // phụ cấp xe bus
            $formularBusAllowance = ParamaterFormula::where('Code', 'PC_BUS')->first();
            $busAllowance = $this->getFormular(json_decode($formularBusAllowance->Recipe), $contract, $parameter);
            $busAllowance = eval('return ' . $busAllowance . ';');
            $parameter['PC_BUS'] = $busAllowance;

            //tổng thu nhập trong tháng
            $formularTotalIncomeMonth = ParamaterFormula::where('Code', 'TONG_THU_NHAP_TRONG_THANG')->first();
            $totalIncomeMonth = $this->getFormular(json_decode($formularTotalIncomeMonth->Recipe), $contract, $parameter);
            $totalIncomeMonth = eval('return ' . $totalIncomeMonth . ';');
            $parameter['TONG_THU_NHAP_TRONG_THANG'] = $totalIncomeMonth;

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

            // giảm trừ bản thân và người phụ thuộc
            $formularDependentPerson = ParamaterFormula::where('Code', 'GIAM_TRU_BAN_THAN_PHU_THUOC')->first();
            $dependentPerson = $this->getFormular(json_decode($formularDependentPerson->Recipe), $contract, $parameter);
            $dependentPerson = eval('return ' . $dependentPerson . ';');
            $parameter['GIAM_TRU_BAN_THAN_PHU_THUOC'] = $dependentPerson;

            //tổng giảm trừ
            $formularDependentTotal = ParamaterFormula::where('Code', 'TONG_GIAM_TRU')->first();
            $dependentTotal = $this->getFormular(json_decode($formularDependentTotal->Recipe), $contract, $parameter);
            $dependentTotal = eval('return ' . $dependentTotal . ';');
            $parameter['TONG_GIAM_TRU'] = $dependentTotal;

            // thu nhập tính thuế
            $formularRentalIncome = ParamaterFormula::where('Code', 'THU_NHAP_TINH_THUE')->first();
            $rentalIncome = $this->getFormular(json_decode($formularRentalIncome->Recipe), $contract, $parameter);
            $rentalIncome = eval('return ' . $rentalIncome . ';');
            $parameter['THU_NHAP_TINH_THUE'] = $rentalIncome;

            // thuế tncn
            $personalIncomeTax = 0; // chưa làm
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
                'DateStartWork' => null,
                'IsProbation' => false,
                'IsMaternity' => false,
                'IsSocialInsurance' => false,
                'BasicSalaryAndAllowance' => $basicSalaryAndAllowance,
                'IncurredAllowance' => $incurredAllowance,
                'TotalIncome' => (int) $totalIncome,
                'KpiBonus' => null,
                'OtTax' => (int) $totalOtFax,
                'OtNoTax' => (int) $totalOtNoFax,
                'UnpaidLeave' => null,
                'TotalWork' => (int) $totalWorks,
                'TotalIncomeMonth' => (int) $totalIncomeMonth,
                'SocialInsuranceEmployee' => (int) $socialInsuranceEmployee,
                'SocialInsuranceAdjustedEmployee' => null,
                'SocialInsuranceCompany' => (int) $socialInsuranceEmployee,
                'SocialInsuranceAdjustedCompany' => null,
                'HealthInsuranceEmployee' => (int) $healthInsuranceEmployee,
                'HealthInsuranceCompany' => (int) $healthInsuranceCompany,
                'UnemploymentInsuranceEmployee' => (int) $unemploymentInsuranceEmployee,
                'UnemploymentInsuranceCompany' => (int) $unemploymentInsuranceCompany,
                'UnionDues' => null,
                'DependentPerson' => null,
                'Eeduce' => null,
                'Charity' => $dependentPerson,
                'TotalReduce' => (int) $dependentTotal,
                'RentalIncome' => (int) $rentalIncome,
                'PersonalIncomeTax' => (int) $personalIncomeTax,
                'SocialInsurancePayment' => null,
                'Advance' => null,
                'ActuallyReceived' => (int) $actuallyReceived,
                'Note' => null,
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
                            $value = $valueVariable->ValueDefault;
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
