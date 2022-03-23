<?php

namespace GGPHP\Absent\Repositories\Eloquent;

use alhimik1986\PhpExcelTemplator\params\CallbackParam;
use alhimik1986\PhpExcelTemplator\PhpExcelTemplator;
use Carbon\Carbon;
use GGPHP\Absent\Models\Absent;
use GGPHP\Absent\Presenters\AbsentPresenter;
use GGPHP\Absent\Repositories\Absent\AbsentRepository;
use GGPHP\Absent\Services\AbsentDetailServices;
use GGPHP\Category\Models\Branch;
use GGPHP\Category\Models\Division;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\PositionLevel\Models\PositionLevel;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AbsentRepositoryEloquent extends CoreRepositoryEloquent implements AbsentRepository
{
    protected $employeeRepositoryEloquent;
    protected $excelExporterServices;
    public function __construct(
        UserRepositoryEloquent $employeeRepositoryEloquent,
        Application $app,
        ExcelExporterServices $excelExporterServices
    ) {
        parent::__construct($app);
        $this->employeeRepositoryEloquent = $employeeRepositoryEloquent;
        $this->excelExporterServices = $excelExporterServices;
    }

    protected $fieldSearchable = [
        'AbsentTypeId',
        'AbsentReasonId',
        'Employee.FullName' => 'like',
        'CreationTime',
    ];
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Absent::class;
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
        return AbsentPresenter::class;
    }

    /**
     * FilterAbsent
     * @param $attributes
     * @return mixed
     */
    public function filterAbsent($attributes, $parse = true)
    {
        if (!empty($attributes['absentTypeId'])) {
            $this->model = $this->model->where('AbsentTypeId', $attributes['absentTypeId']);
        }

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        if (!empty($attributes['fullName'])) {
            $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['fullName']);
            });
        }

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where(function ($q2) use ($attributes) {
                $q2->where([['StartDate', '<=', $attributes['startDate']], ['EndDate', '>=', $attributes['endDate']]])
                    ->orWhere([['StartDate', '>=', $attributes['startDate']], ['StartDate', '<=', $attributes['endDate']]])
                    ->orWhere([['EndDate', '>=', $attributes['startDate']], ['EndDate', '<=', $attributes['endDate']]]);
            });
        }

        if (!empty($attributes['limit'])) {
            $absents = $this->paginate($attributes['limit']);
        } else {
            $absents = $this->get();
        }

        return $absents;
    }

    /**
     * Get Absent
     * @param $attributes
     * @return mixed
     */
    public function getAbsent($attributes)
    {
        $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->query();

        $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->with(['absent' => function ($query) use ($attributes) {
            if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                $query->whereDate('StartDate', '>=', $attributes['startDate'])->whereDate('StartDate', '<=', $attributes['endDate']);
            }

            if (!empty($attributes['absentTypeId'])) {
                $query->where('AbsentTypeId', $attributes['absentTypeId']);
            }
        }]);

        if (!empty($attributes['employeeId'])) {
            $this->employeeRepositoryEloquent->model->whereIn('Id', explode(',', $attributes['employeeId']));
        }

        if (!empty($attributes['limit'])) {
            $employees = $this->employeeRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $employees = $this->employeeRepositoryEloquent->get();
        }

        return $employees;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $absent = Absent::create($attributes);

            AbsentDetailServices::add($absent->Id, $attributes['detail']);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($absent->Id);
    }

    public function update(array $attributes, $id)
    {
        $absent = Absent::findOrFail($id);

        \DB::beginTransaction();
        try {
            $absent->update($attributes);
            $absent->absentDetail()->delete();
            AbsentDetailServices::add($id, $attributes['detail']);
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($id);
    }

    public function reportAbsent($attributes, $parser = false)
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
        })->whereHas('absent', function ($queryAbsent) use ($attributes) {
            if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                $queryAbsent->where([['StartDate', '<=', $attributes['startDate']], ['EndDate', '>=', $attributes['endDate']]])
                    ->orWhere([['StartDate', '>=', $attributes['startDate']], ['StartDate', '<=', $attributes['endDate']]])
                    ->orWhere([['EndDate', '>=', $attributes['startDate']], ['EndDate', '<=', $attributes['endDate']]]);
            }
        })->where(function ($queryEmployee) use ($attributes) {
            if (!empty($attributes['employeeId'])) {
                $queryEmployee->where('Id', $attributes['employeeId']);
            }
        })->with(['absent' => function ($queryAbsent) use ($attributes) {
            if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                $queryAbsent->where([['StartDate', '<=', $attributes['startDate']], ['EndDate', '>=', $attributes['endDate']]])
                    ->orWhere([['StartDate', '>=', $attributes['startDate']], ['StartDate', '<=', $attributes['endDate']]])
                    ->orWhere([['EndDate', '>=', $attributes['startDate']], ['EndDate', '<=', $attributes['endDate']]]);
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
                foreach ($employee->absent as $key => $absent) {
                    $branchName =  $positionLevel->branch->Name;
                    $divisionName = $positionLevel->division->Name;

                    if (!array_key_exists($branchName, $result)) {
                        $result[$branchName] =  [
                            'branchName' => $branchName,
                            'divisionName' => []
                        ];
                    }

                    if (!array_key_exists($divisionName, $result[$branchName]['divisionName'])) {
                        $result[$branchName]['divisionName'][$divisionName] =  [
                            'divisionName' => $divisionName,
                            'absent' => [],
                        ];
                    }
                    $result[$branchName]['divisionName'][$divisionName]['absent'][] =  [
                        'employeeCode' => $absent->employee->Code,
                        'employeeName' => $absent->employee->FullName,
                        'absentId' => $absent->Id,
                        'startDate' => $absent->StartDate->format('Y-m-d'),
                        'endDate' => $absent->EndDate->format('Y-m-d'),
                        'reason' => $absent->Reason
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

    public function exportExcelAbsent($attributes)
    {
        $absents = $this->reportAbsent($attributes, true);
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
        $startDate = 'ngày-tháng-năm';
        $endDate = 'ngày-tháng-năm';
        if (isset($attributes['startDate'])) {
            $startDate = Carbon::parse($attributes['startDate'])->format('d-m-Y');
        }

        if (isset($attributes['endDate'])) {
            $endDate = Carbon::parse($attributes['endDate'])->format('d-m-Y');
        }
        $number = 0;
        $params['{time}'] = $startDate . ' -- ' . $endDate;
        $params['{branch}'] = is_null($branch) ? '--Tất cả--' : $branch->Name;
        $params['{division}'] = is_null($division) ? '--Tất cả--' : $division->Name;
        $params['{employee}'] = is_null($employee) ? '--Tất cả--' : $employee->FullName;
        $params['[code]'] = [];
        $params['[fullName]'] = [];
        $params['[startDate]'] = [];
        $params['[endDate]'] =  [];
        $params['[reason]'] =  [];
        foreach ($absents as $key => $absent) {
            $params['[stt]'][] = $absent['branchName'] . '.branch';
            $params['[code]'][] = '';
            $params['[fullName]'][] = '';
            $params['[startDate]'][] = '';
            $params['[endDate]'][] = '';
            $params['[reason]'][] = '';
            foreach ($absent['divisionName'] as $key => $division) {
                $params['[stt]'][] = '       ' . $division['divisionName'] . '.division';
                $params['[code]'][] = '';
                $params['[fullName]'][] = '';
                $params['[startDate]'][] = '';
                $params['[endDate]'][] = '';
                $params['[reason]'][] = '';
                foreach ($division['absent'] as $key => $value) {
                    $params['[stt]'][] = $number += 1;
                    $params['[code]'][] = $value['employeeCode'];
                    $params['[fullName]'][] = $value['employeeName'];
                    $params['[startDate]'][] = $value['startDate'];
                    $params['[endDate]'][] = $value['endDate'];
                    $params['[reason]'][] = $value['reason'];
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
                    $merge = $cell_coordinate . ':' . 'G' . $currentRow;
                    $listMerge[] = $merge;
                }

                if ($value[count($value) - 1] == 'division') {
                    $division = $cell_coordinate;
                    $sheet->getCell($cell_coordinate)->setValue($value[0]);
                    $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                        ->setARGB('EDF7EA');

                    $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                    $merge = $cell_coordinate . ':' . 'G' . $currentRow;
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

        return $this->excelExporterServices->export('absent', $params, $callbacks, $events);
    }
}
