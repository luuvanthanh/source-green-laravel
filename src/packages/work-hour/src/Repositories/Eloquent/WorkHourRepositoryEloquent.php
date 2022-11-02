<?php

namespace GGPHP\WorkHour\Repositories\Eloquent;

use alhimik1986\PhpExcelTemplator\params\CallbackParam;
use alhimik1986\PhpExcelTemplator\PhpExcelTemplator;
use Carbon\Carbon;
use GGPHP\Category\Models\Branch;
use GGPHP\Category\Models\Division;
use GGPHP\Category\Models\HolidayDetail;
use GGPHP\Clover\Models\EmployeeAccount;
use GGPHP\Core\Jobs\SendNotiWithoutCode;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use GGPHP\WorkHour\Models\ApprovalEmployeeWorkHour;
use GGPHP\WorkHour\Models\WorkHour;
use GGPHP\WorkHour\Presenters\WorkHourPresenter;
use GGPHP\WorkHour\Repositories\Contracts\WorkHourRepository;
use Illuminate\Container\Container as Application;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class WorkHourRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class WorkHourRepositoryEloquent extends CoreRepositoryEloquent implements WorkHourRepository
{
    protected $fieldSearchable = [
        'Id',
        'CreationTime',
    ];

    public function __construct(
        UserRepositoryEloquent $employeeRepositoryEloquent,
        ExcelExporterServices $excelExporterServices,
        Application $app
    ) {
        parent::__construct($app);
        $this->excelExporterServices = $excelExporterServices;
        $this->employeeRepositoryEloquent = $employeeRepositoryEloquent;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return WorkHour::class;
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
        return WorkHourPresenter::class;
    }

    public function filterWorkHour(array $attributes)
    {

        if (!empty($attributes['startDate']) && !empty($attributes['startDate'])) {
            $this->model = $this->model->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
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

        if (!empty($attributes['limit'])) {
            $workHour = $this->paginate($attributes['limit']);
        } else {
            $workHour = $this->get();
        }

        return $workHour;
    }

    public function create(array $attributes)
    {
        try {
            $attributes = $this->creating($attributes);
            $attributes['hours'] = json_encode($attributes['hours']);
            $workHour = WorkHour::create($attributes);
            $this->created($workHour, $attributes);
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        $account = [];

        if (!empty($attributes['approvalEmployee'])) {
            $account = $this->getAccountEmployee($attributes);
        }

        if (!empty($account)) {
            $attributes['title'] = 'Phiếu đăng ký';
            $attributes['message'] = 'Bạn có phiếu đăng ký làm thêm cần duyệt';
            $this->sendNoti($account, $workHour, $attributes);
        }

        return parent::find($workHour->Id);
    }

    public function creating($attributes)
    {
        if (!empty($attributes['status'])) {

            $attributes['status'] = WorkHour::STATUS[$attributes['status']];
        } else {
            $attributes['status'] = WorkHour::STATUS['WAITING_APPROVAL'];
        }

        if (!empty($attributes['registrationDateType'])) {
            $attributes['registrationDateType'] = WorkHour::REGISTRATION_DATE_TYPE[$attributes['registrationDateType']];
        }

        return $attributes;
    }

    public function created($workHour, $attributes)
    {
        if (!empty($attributes['approvalEmployee'])) {
            foreach ($attributes['approvalEmployee'] as $key => $value) {

                $data = [
                    'WorkHourId' => $workHour->Id,
                    'employeeId' => $value
                ];

                ApprovalEmployeeWorkHour::create($data);
            }
        }

        return null;
    }

    public function getAccountEmployee($attributes)
    {
        $accountEmployee = EmployeeAccount::whereIn('EmployeeId', $attributes['approvalEmployee'])->get();

        $appUserId = $accountEmployee->map(function ($item) {
            return $item->AppUserId;
        })->toArray();

        return $appUserId;
    }

    public function sendNoti($account, $workHour, $attributes)
    {
        $dataNoti = [
            'users' => $account,
            'title' => $attributes['title'],
            'imageURL' => 'image',
            'message' => $attributes['message'],
            'moduleType' => 24,
            'refId' => $workHour->Id,
        ];

        dispatch(new SendNotiWithoutCode($dataNoti));
    }

    public function update(array $attributes, $id)
    {
        $workHour = WorkHour::findOrFail($id);
        $this->updated($workHour, $attributes);
        $attributes['hours'] = json_encode($attributes['hours']);
        $workHour->update($attributes);

        return parent::find($workHour->Id);
    }

    public function updated($workHour, $attributes)
    {
        if (!empty($attributes['approvalEmployee'])) {
            $workHour->approvalEmployeeWorkHour()->delete();
            foreach ($attributes['approvalEmployee'] as $key => $value) {
                $data = [
                    'workHourId' => $workHour->Id,
                    'employeeId' => $value
                ];

                ApprovalEmployeeWorkHour::create($data);
            }
        }

        return null;
    }

    public function workHourSummary(array $attributes, $parser = false)
    {
        $employees = $this->employeeRepositoryEloquent->model->whereHas('workHours', function ($query) use ($attributes) {
            $query->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
        })->with(['workHours' => function ($query) use ($attributes) {
            $query->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
        }]);

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $employees->whereIn('Id', $employeeId);
        }

        $employees->tranferHistory($attributes);
        $employees->status(User::STATUS['WORKING']);

        if (!empty($attributes['fullName'])) {
            $employees->whereLike('FullName', $attributes['fullName']);
        }

        $employees->where(function ($query) use ($attributes) {
            $query->where('DateOff', '>=', $attributes['startDate'])
                ->orWhere('DateOff', null);
        });

        if (empty($attributes['limit'])) {
            $result = $employees->get();
        } else {
            $result = $employees->paginate($attributes['limit']);
        }

        $holidayDetails = HolidayDetail::where(function ($q2) use ($attributes) {
            $q2->where([['StartDate', '<=', $attributes['startDate']], ['EndDate', '>=', $attributes['endDate']]])
                ->orWhere([['StartDate', '>=', $attributes['startDate']], ['StartDate', '<=', $attributes['endDate']]])
                ->orWhere([['EndDate', '>=', $attributes['startDate']], ['EndDate', '<=', $attributes['endDate']]]);
        })->get();

        $holiday = [];

        if (!empty(count($holidayDetails))) {
            foreach ($holidayDetails as $holidayDetail) {
                $begin = new \DateTime($holidayDetail->StartDate->format('Y-m-d'));
                $end = new \DateTime($holidayDetail->EndDate->format('Y-m-d'));
                $intervalDate = \DateInterval::createFromDateString('1 day');
                $periodDate = new \DatePeriod($begin, $intervalDate, $end->modify('+1 day'));

                foreach ($periodDate as $date) {
                    if (!in_array($date->format('Y-m-d'), $holiday)) {
                        $holiday[] = $date->format('Y-m-d');
                    }
                }
            }
        }

        foreach ($result as &$employee) {
            $employee = $this->calculatorWorkHourReport($employee, $holiday);
        }

        if ($parser) {
            return $result;
        }

        return $this->employeeRepositoryEloquent->parserResult($result);
    }

    public function calculatorWorkHourReport($employee, $holiday)
    {
        $workHours = $employee->workHours->toArray();
        $newWorkHours = [];
        $totalWorkHourSummary = 0;
        $totalWorkWeekday = 0;
        $totalWorkWeekend = 0;
        $totalWorkHoliday = 0;

        if (count($workHours) > 0) {
            foreach ($workHours as $key => $workHour) {
                $date = Carbon::parse($workHour['Date'])->format('Y-m-d');
                $hours = json_decode($workHour['Hours'])[0];
                $time = (strtotime($hours->out) - strtotime($hours->in)) / 3600;

                if (array_key_exists($date, $newWorkHours)) {
                    $newWorkHours[$date]['value'] += $time;
                } else {
                    $newWorkHours[$date] = [
                        'date' => $date,
                        'value' => $time
                    ];
                }

                if (in_array($date, $holiday)) {
                    $totalWorkHoliday += $time;
                } else {
                    $check = Carbon::parse($workHour['Date'])->setTimezone('GMT+7')->format('l');

                    if ($check === 'Saturday' || $check === 'Sunday') {
                        $totalWorkWeekend += $time;
                    } else {
                        $totalWorkWeekday += $time;
                    }
                }

                $totalWorkHourSummary += $time;
            }
        }

        $employee->workHourSummary = array_values($newWorkHours);
        $employee->totalWorkHourSummary = $totalWorkHourSummary;
        $employee->totalWorkWeekday = $totalWorkWeekday;
        $employee->totalWorkWeekend = $totalWorkWeekend;
        $employee->totalWorkHoliday = $totalWorkHoliday;

        return $employee;
    }

    public function exportWorkHourReport(array $attributes)
    {
        $results = $this->workHourSummary($attributes, true);

        $branch = '.............';
        $division = '.............';
        if (!empty($attributes['branchId'])) {
            $branch = Branch::find($attributes['branchId'])->Name;
        }

        if (!empty($attributes['divisionId'])) {
            $division = Division::find($attributes['divisionId'])->Name;
        }

        $params = [];
        $params['{month}'] = Carbon::parse($attributes['endDate'])->format('m');
        $params['{branch}'] = $branch;
        $params['{division}'] = $division;
        $params['{confirm}'] = '';
        $params['{work}'] = '';
        $params['{sign}'] = '';
        $params['[number]'] = [];
        $params['[fullName]'] = [];
        $params['[position]'] = [];
        $params['[totalWork]'] = [];
        $params['[sign]'] = [];
        $init_value = [];
        $month = [];

        $period = Carbon::create($attributes['startDate'])->daysUntil($attributes['endDate']);
        $period->setLocale('vi_VN');
        $params['[[date]]'][] = iterator_to_array($period->map(function (Carbon $date) use (&$init_value, &$month) {
            $check = Carbon::parse($date)->setTimezone('GMT+7')->format('l');

            $month[] = 'Tháng ' . $date->format('m');
            if ($check === 'Saturday' || $check === 'Sunday') {
                $init_value[$date->format('Y-m-d')] = 'WK'; // cuối tuần
            } else {
                $init_value[$date->format('Y-m-d')] = '-';
            }

            return $date->format('d');
        }));

        foreach ($results as $key => $user) {
            $params['[number]'][] = ++$key;
            $params['[fullName]'][] = $user->FullName;
            $params['[position]'][] = $user->positionLevelNow->position->Name ?? '';
            $values = $init_value;

            if (!empty($user->workHourSummary)) {
                foreach ($user->workHourSummary as $item) {
                    if ($values[$item['date']] == 'WK') {
                        $values[$item['date']] = $values[$item['date']] . ',' . round($item['value'], 2);
                    } else {

                        $values[$item['date']] = $item['value'] ? round($item['value'], 2) : '_';
                    }
                }
            }

            $params['[[values]]'][] = array_values($values);
            $params['[totalWork]'][] = round($user->totalWorkHourSummary, 2);
            $params['[sign]'][] = '';
        }

        $params['[[month]]'][] = array_values($month);

        $listMerge = [];
        $listIndexValue = [];
        $listRowTs = [];

        $callbacks = [
            '[[month]]' => function (CallbackParam $param) use (&$listMerge) {
                $sheet = $param->sheet;
                $row_index = $param->row_index;
                $col_index = $param->col_index;
                $cell_coordinate = $param->coordinate;
                $value = $param->param[$row_index][$col_index];
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $mergeCoordinate[] = $cell_coordinate;
                $firstValue = $param->param[$row_index][0];

                if ($cell_coordinate == 'D3') {
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
                        $merge = $mergeCoordinate[$key - 1] . ':' . $mergeCoordinate[$key];
                        $listMerge[] = $merge;
                    }
                }
            },
            '[[values]]' => function (CallbackParam $param) use (&$listMerge, &$listRowTs) {

                $sheet = $param->sheet;
                $row_index = $param->row_index;
                $col_index = $param->col_index;
                $cell_coordinate = $param->coordinate;
                $value = $param->param[$row_index][$col_index];
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $listMergeValue = [];

                if (strpos($value, 'WK') !== false) {
                    $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                        ->setARGB('5b9bd5');
                    $sheet->getStyle($cell_coordinate)->getFont()->setBold(false);

                    $value = explode(',', $value);

                    if (count($value) > 1) {
                        $sheet->getCell($cell_coordinate)->setValue($value[1]);
                    } else {
                        $sheet->getCell($cell_coordinate)->setValue(null);
                    }
                }
                $sheet->getColumnDimension($currentColumn)->setWidth(3);
            },
            '{work}' => function (CallbackParam $param) use (&$listMerge) {
                $sheet = $param->sheet;
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ':' . $mergeCol;

                $listMerge[] = $merge;
            },
            '{sign}' => function (CallbackParam $param) use (&$listMerge) {
                $sheet = $param->sheet;
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ':' . $mergeCol;

                $listMerge[] = $merge;
            },
            '{confirm}' => function (CallbackParam $param) use (&$listMerge) {
                $sheet = $param->sheet;
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);

                $mergeColFirst = 'AI' . $currentRow;
                $mergeColEnd = 'AJ' . $currentRow;

                $sheet->getCell($mergeColFirst)->setValue('Trưởng bộ phận xác nhận');
                $sheet->getCell($cell_coordinate)->setValue(null);

                $merge = $mergeColFirst . ':' . $mergeColEnd;

                $listMerge[] = $merge;
            },
        ];

        $events = [
            PhpExcelTemplator::AFTER_INSERT_PARAMS => function (Worksheet $sheet, array $templateVarsArr) use (&$listMerge) {

                foreach ($listMerge as $item) {
                    $sheet->mergeCells($item);
                }
                $sheet->mergeCells('A1:AJ2');
            },

        ];

        return $this->excelExporterServices->export('work_hour_report', $params, $callbacks, $events);
    }

    public function updateStatusWorkHour($attributes, $id)
    {
        $workHour = WorkHour::findOrFail($id);
        $attributes['approvalEmployee'] = [$workHour->EmployeeId];
        $account = $this->getAccountEmployee($attributes);
        $workHour->Status = $attributes['status'];
        $attributes['title'] = 'Phiếu đăng ký';

        if ($attributes['status'] == WorkHour::STATUS['APPROVED']) {
            if (!empty($account)) {
                $attributes['message'] = 'Bạn có phiếu đăng ký làm thêm giờ đã được duyệt';
                $this->sendNoti($account, $workHour, $attributes);
            }
        }

        if ($attributes['status'] == WorkHour::STATUS['NOT_APPROVED']) {
            if (!empty($account)) {
                $attributes['message'] = 'Bạn có phiếu đăng ký làm thêm giờ không được duyệt';
                $this->sendNoti($account, $workHour, $attributes);
            }

            $workHour->ReasonNotApproved = $attributes['reasonNotApproved'];
        }

        $workHour->update();

        return $this->parserResult($workHour);
    }

    public function sendAgain($id)
    {
        $workHour = WorkHour::findOrFail($id);
        $attributes['approvalEmployee'] = [$workHour->EmployeeId];
        $account = $this->getAccountEmployee($attributes);

        if (!empty($account)) {
            $attributes['title'] = 'Phiếu đăng ký';
            $attributes['message'] = 'Bạn có phiếu đăng ký làm thêm cần duyệt';

            $this->sendNoti($account, $workHour, $attributes);
        }

        return [];
    }

    public function registrationDateType()
    {
        $data = array_keys(WorkHour::REGISTRATION_DATE_TYPE);
        
        return $data;
    }
}
