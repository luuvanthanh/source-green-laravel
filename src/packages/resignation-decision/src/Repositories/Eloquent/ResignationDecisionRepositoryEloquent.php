<?php

namespace GGPHP\ResignationDecision\Repositories\Eloquent;

use alhimik1986\PhpExcelTemplator\params\CallbackParam;
use alhimik1986\PhpExcelTemplator\PhpExcelTemplator;
use Carbon\Carbon;
use GGPHP\Category\Models\Branch;
use GGPHP\Category\Models\Division;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\ResignationDecision\Models\ResignationDecision;
use GGPHP\ResignationDecision\Presenters\ResignationDecisionPresenter;
use GGPHP\ResignationDecision\Repositories\Contracts\ResignationDecisionRepository;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;
use \GGPHP\Users\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * Class ResignationDecisionRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ResignationDecisionRepositoryEloquent extends CoreRepositoryEloquent implements ResignationDecisionRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'DecisionNumber' => 'like',
        'EmployeeId',
        'CreationTime',
    ];

    /**
     * @param Application $app
     * @param ExcelExporterServices $wordExporterServices
     */
    public function __construct(
        WordExporterServices $wordExporterServices,
        Application $app,
        ExcelExporterServices $excelExporterServices
    ) {
        parent::__construct($app);
        $this->wordExporterServices = $wordExporterServices;
        $this->excelExporterServices = $excelExporterServices;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ResignationDecision::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return ResignationDecisionPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function getResignationDecision(array $attributes)
    {
        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        if (!empty($attributes['fullName'])) {
            $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['fullName']);
            });
        }

        if (!empty($attributes['limit'])) {
            $resignationDecision = $this->paginate($attributes['limit']);
        } else {
            $resignationDecision = $this->get();
        }

        return $resignationDecision;
    }

    public function create(array $attributes)
    {
        $resignationDecision = ResignationDecision::create($attributes);

        $employee = User::where('Id', $attributes['employeeId'])->first();

        $employee->update([
            'DateOff' => $attributes['timeApply'],
            'Status' => User::STATUS['STORE'],
        ]);

        $employee->labourContract()->update(['IsEffect' => false]);
        $employee->probationaryContract()->update(['IsEffect' => false]);

        return parent::find($resignationDecision->Id);
    }

    public function delete($id)
    {
        $resignationDecision = ResignationDecision::findOrFail($id);
        $employee = User::find($resignationDecision->EmployeeId);

        if (!is_null($employee)) {
            $employee->update(['DateOff' => null]);
            $employee->labourContract()->update(['IsEffect' => true]);
            $employee->probationaryContract()->update(['IsEffect' => true]);
        }

        return $resignationDecision->delete();
    }

    public function exportWord($id)
    {
        $resignationDecision = ResignationDecision::findOrFail($id);

        $employee = $resignationDecision->employee;
        $labourContract = $employee->labourContract->last();

        if ($labourContract) {
            $contractNumber = !is_null($labourContract->ContractNumber) ? $labourContract->ContractNumber : $labourContract->OrdinalNumber . '/' . $labourContract->NumberForm;
        } else {
            $contractNumber = '........';
        }

        $params = [
            'decisionNumber' => $resignationDecision->DecisionNumber,
            'decisionNumberLabourContract' => $contractNumber,
            'date' => $labourContract ? $labourContract->ContractDate->format('d') : '........',
            'month' => $labourContract ? $labourContract->ContractDate->format('m') : '........',
            'year' => $labourContract ? $labourContract->ContractDate->format('Y') : '........',
            'decisionDate' => $resignationDecision->DecisionDate ? $resignationDecision->DecisionDate->format('d-m-Y') : '.......',
            'timeApply' => $resignationDecision->TimeApply->format('d-m-Y'),
            'dateNow' => $resignationDecision->DecisionDate ? $resignationDecision->DecisionDate->format('d') : '.......',
            'monthNow' => $resignationDecision->DecisionDate ? $resignationDecision->DecisionDate->format('m') : '.......',
            'yearNow' => $resignationDecision->DecisionDate ? $resignationDecision->DecisionDate->format('Y') : '.......',
            'branchWord' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->Name : '........',
            'position' => $employee->positionLevelNow ? $employee->positionLevelNow->position->Name : '........',
            'positionDivision' => $employee->positionLevelNow ? $employee->positionLevelNow->position->Name . ' - ' . $employee->positionLevelNow->division->Name : '........',
            'fullName' => $employee->FullName ? $employee->FullName : '........',
            'payEndDate' => $resignationDecision->PayEndDate ? $resignationDecision->PayEndDate->format('d-m-Y') : '........',
        ];

        return $this->wordExporterServices->exportWord('resignation_decision', $params);
    }

    public function reportResignation($attributes, $parser = false)
    {
        $result = [];
        $employees = User::whereHas('positionLevel', function ($queryPositionLevel) use ($attributes) {
            if (!empty($attributes['branchId'])) {
                $queryPositionLevel->where('BranchId', $attributes['branchId']);
            }
            if (!empty($attributes['divisionId'])) {
                $queryPositionLevel->where('DivisionId', $attributes['divisionId']);
            }
            $now = Carbon::now()->format('Y-m-d');
            $queryPositionLevel->where(function ($q) use ($now) {
                $q->where([['StartDate', '<=', $now], ['EndDate', '>=', $now]])
                    ->orWhere([['StartDate', '<=', $now], ['EndDate', null]]);
            });
        })->whereHas('resignationDecision', function ($queryAbsent) use ($attributes) {
            if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                $queryAbsent->where('DecisionDate', '>=', $attributes['startDate'])->where('DecisionDate', '<=', $attributes['endDate']);
            }
        })->where(function ($queryEmployee) use ($attributes) {
            if (!empty($attributes['employeeId'])) {
                $queryEmployee->where('Id', $attributes['employeeId']);
            }
        })->with(['resignationDecision' => function ($queryAbsent) use ($attributes) {
            if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                $queryAbsent->where('DecisionDate', '>=', $attributes['startDate'])->where('DecisionDate', '<=', $attributes['endDate']);
            }
        }])->with(['positionLevel' => function ($queryPositionLevel) use ($attributes) {
            if (!empty($attributes['branchId'])) {
                $queryPositionLevel->where('BranchId', $attributes['branchId']);
            }
            if (!empty($attributes['divisionId'])) {
                $queryPositionLevel->where('DivisionId', $attributes['divisionId']);
            }

            $now = Carbon::now()->format('Y-m-d');
            $queryPositionLevel->where(function ($q2) use ($now) {
                $q2->where([['StartDate', '<=', $now], ['EndDate', '>=', $now]])
                    ->orWhere([['StartDate', '<=', $now], ['EndDate', null]]);
            });
        }])->get();
        foreach ($employees as $key => $employee) {
            foreach ($employee->positionLevel as $key => $positionLevel) {
                $resignationDecision = $employee->resignationDecision;
                $branchName =  $positionLevel->branch->Name;
                $divisionName = $positionLevel->division->Name;
                $positionName = $positionLevel->position->Name;
                if (!array_key_exists($branchName, $result)) {
                    $result[$branchName] =  [
                        'branchName' => $branchName,
                        'divisionName' => []
                    ];
                }

                if (!array_key_exists($divisionName, $result[$branchName]['divisionName'])) {
                    $result[$branchName]['divisionName'][$divisionName] =  [
                        'divisionName' => $divisionName,
                        'resignationDecision' => [],
                    ];
                }

                if (!is_null($resignationDecision)) {
                    $result[$branchName]['divisionName'][$divisionName]['resignationDecision'][] =  [
                        'employeeCode' => $resignationDecision->employee->Code,
                        'employeeName' => $resignationDecision->employee->FullName,
                        'resignationDecisiontId' => $resignationDecision->Id,
                        'division' => $divisionName,
                        'branch' => $branchName,
                        'position' => $positionName,
                        'decisionDate' => $resignationDecision->DecisionDate->format('Y-m-d'),
                        'decisionNumber' => $resignationDecision->DecisionNumber,
                        'timeApply' => $resignationDecision->TimeApply->format('Y-m-d'),
                        'payEndDate' => $resignationDecision->PayEndDate->format('Y-m-d'),
                        'reason' => $resignationDecision->Reason,
                        'note' => $resignationDecision->Note
                    ];
                }
            }
        }
        $limit = 2;
        $page = 1;
        if (!empty($attributes['limit'])) {
            $limit = $attributes['limit'];
        }

        if (!empty($attributes['page'])) {
            $page = $attributes['page'];
        }
        if ($parser) {
            return $result;
        }
        $result = $this->paginateCollection($result, $limit, $page);
        return $result;
    }

    public function paginateCollection($items, $perPage = 2, $page = null, $options = [])
    {
        $page = $page ?: (Paginator::resolveCurrentPage() ?: 1);
        $items = $items instanceof Collection ? $items : Collection::make($items);

        $result = new LengthAwarePaginator($items->forPage($page, $perPage), $items->count(), $perPage, $page, $options);
        $result->setPath(request()->url());

        return $result;
    }

    public function exportExcelResignation($attributes)
    {
        $resignations = $this->reportResignation($attributes, true);
        $branch = null;
        if (!empty($attributes['branchId'])) {
            $branch = Branch::where('Id', $attributes['branchId'])->first();
        }

        $division = null;
        if (!empty($attributes['divisionId'])) {
            $division = Division::where('Id', $attributes['divisionId'])->first();
        }

        $employee = null;
        if (!empty($attributes['employeeId'])) {
            $employee = User::where('Id', $attributes['employeeId'])->first();
        }
        $startDate = 'ngày/tháng/năm';
        $endDate = 'ngày/tháng/năm';
        if (isset($attributes['startDate'])) {
            $startDate = Carbon::parse($attributes['startDate'])->format('d/m/Y');
        }

        if (isset($attributes['endDate'])) {
            $endDate = Carbon::parse($attributes['endDate'])->format('d/m/Y');
        }
        $number = 0;
        $params['{time}'] = $startDate . ' -- ' . $endDate;
        $params['{branchName}'] = is_null($branch) ? '--Tất cả--' : $branch->Name;
        $params['{divisionName}'] = is_null($division) ? '--Tất cả--' : $division->Name;
        $params['{employee}'] = is_null($employee) ? '--Tất cả--' : $employee->FullName;
        $params['[code]'] = [];
        $params['[fullName]'] = [];
        $params['[position]'] = [];
        $params['[branch]'] = [];
        $params['[division]'] = [];
        $params['[decisionDate]'] = [];
        $params['[decisionNumber]'] = [];
        $params['[timeApply]'] = [];
        $params['[payEndDate]'] = [];
        $params['[reason]'] = [];
        $params['[note]'] =  [];
        foreach ($resignations as $key => $resignation) {
            $params['[stt]'][] = $resignation['branchName'] . '.branch';
            $params['[code]'][] = '';
            $params['[fullName]'][] = '';
            $params['[position]'][] = '';
            $params['[branch]'][] = '';
            $params['[division]'][] = '';
            $params['[decisionDate]'][] = '';
            $params['[decisionNumber]'][] = '';
            $params['[timeApply]'][] = '';
            $params['[payEndDate]'][] = '';
            $params['[reason]'][] = '';
            $params['[note]'][] = '';
            foreach ($resignation['divisionName'] as $key => $division) {
                $params['[stt]'][] = '       ' . $division['divisionName'] . '.division';
                $params['[code]'][] = '';
                $params['[fullName]'][] = '';
                $params['[position]'][] = '';
                $params['[branch]'][] = '';
                $params['[division]'][] = '';
                $params['[decisionDate]'][] = '';
                $params['[decisionNumber]'][] = '';
                $params['[timeApply]'][] = '';
                $params['[payEndDate]'][] = '';
                $params['[reason]'][] = '';
                $params['[note]'][] = '';
                foreach ($division['resignationDecision'] as $key => $value) {
                    $params['[stt]'][] = $number += 1;
                    $params['[code]'][] = $value['employeeCode'];
                    $params['[fullName]'][] = $value['employeeName'];
                    $params['[position]'][] = $value['position'];
                    $params['[branch]'][] = $value['branch'];
                    $params['[division]'][] = $value['division'];
                    $params['[decisionDate]'][] = Carbon::parse($value['decisionDate'])->format('d/m/Y');
                    $params['[decisionNumber]'][] = $value['decisionNumber'];
                    $params['[timeApply]'][] = Carbon::parse($value['timeApply'])->format('d/m/Y');
                    $params['[payEndDate]'][] = Carbon::parse($value['payEndDate'])->format('d/m/Y');
                    $params['[reason]'][] = $value['reason'];
                    $params['[note]'][] = $value['note'];
                }
                $number = 0;
            }
        }
        $listMerge = [];
        $callbacks = [
            '[stt]' => function (CallbackParam $param) use (&$listMerge) {
                $sheet = $param->sheet;
                $cell_coordinate = $param->coordinate;
                $value =  $sheet->getCell($cell_coordinate)->getValue();
                $value = explode('.', $value);

                if ($value[count($value) - 1] == 'branch') {
                    $branch = $cell_coordinate;
                    $sheet->getCell($cell_coordinate)->setValue($value[0]);
                    $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                        ->setARGB('FCE3D7');
                    $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                    $merge = $cell_coordinate . ':' . 'M' . $currentRow;
                    $listMerge[] = $merge;
                }

                if ($value[count($value) - 1] == 'division') {
                    $division = $cell_coordinate;
                    $sheet->getCell($cell_coordinate)->setValue($value[0]);
                    $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                        ->setARGB('EDF7EA');

                    $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                    $merge = $cell_coordinate . ':' . 'M' . $currentRow;
                    $listMerge[] = $merge;
                }

                if ($value[count($value) - 1] != 'division' && $value[count($value) - 1] != 'branch') {
                    $sheet->getStyle($cell_coordinate)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                }
            }
        ];

        $events = [
            PhpExcelTemplator::AFTER_INSERT_PARAMS => function (Worksheet $sheet, array $templateVarsArr) use (&$listMerge) {
                foreach ($listMerge as $item) {
                    $sheet->mergeCells($item);
                }
            },

        ];

        return $this->excelExporterServices->export('resignation_decision', $params, $callbacks, $events);
    }
}
