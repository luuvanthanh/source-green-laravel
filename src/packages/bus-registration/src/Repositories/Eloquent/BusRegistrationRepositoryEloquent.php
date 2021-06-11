<?php

namespace GGPHP\BusRegistration\Repositories\Eloquent;

use alhimik1986\PhpExcelTemplator\params\CallbackParam;
use alhimik1986\PhpExcelTemplator\PhpExcelTemplator;
use Carbon\Carbon;
use GGPHP\BusRegistration\Models\BusRegistration;
use GGPHP\BusRegistration\Presenters\BusRegistrationPresenter;
use GGPHP\BusRegistration\Repositories\Contracts\BusRegistrationRepository;
use GGPHP\Category\Models\Branch;
use GGPHP\Category\Models\Division;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class BusRegistrationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class BusRegistrationRepositoryEloquent extends CoreRepositoryEloquent implements BusRegistrationRepository
{
    protected $fieldSearchable = [
        'Id',
        'CreationTime',
        'employee.FullName' => 'like',
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
        return BusRegistration::class;
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
        return BusRegistrationPresenter::class;
    }

    public function filterBusRegistration(array $attributes)
    {
        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
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
            $busRegistration = $this->paginate($attributes['limit']);
        } else {
            $busRegistration = $this->get();
        }

        return $busRegistration;
    }

    public function busRegistrationSummary(array $attributes, $parser = false)
    {
        $employees = $this->employeeRepositoryEloquent->model->whereHas('busRegistrations', function ($query) use ($attributes) {
            $query->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
        })->with(['busRegistrations' => function ($query) use ($attributes) {
            $query->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
        }]);

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $employees->whereIn('Id', $employeeId);
        }

        $employees->tranferHistory($attributes);

        $employees->where(function ($query) use ($attributes) {
            $query->where('DateOff', '>=', $attributes['startDate'])
                ->orWhere('DateOff', null);
        });

        if (empty($attributes['limit'])) {
            $result = $employees->get();
        } else {
            $result = $employees->paginate($attributes['limit']);
        }

        foreach ($result as &$employee) {
            $employee = $this->calculatorBusRegistrationReport($employee, $attributes);
        }

        if ($parser) {
            return $result;
        }

        return $this->employeeRepositoryEloquent->parserResult($result);
    }

    public function calculatorBusRegistrationReport($employee, $attributes)
    {
        $busRegistrations = $employee->busRegistrations->toArray();
        $newBusRegistration = [];
        $totalBusRegistration = 0;

        if (count($busRegistrations) > 0) {
            foreach ($busRegistrations as $key => $busRegistration) {
                $date = Carbon::parse($busRegistration['Date'])->format('Y-m-d');

                if (array_key_exists($date, $newBusRegistration)) {
                    $newBusRegistration[$date] += $busRegistration['HourNumber'];
                } else {
                    $newBusRegistration[$date] = $busRegistration['HourNumber'];
                }
            }

            foreach ($newBusRegistration as $key => $value) {
                $newBusRegistration[] = [
                    'date' => $key,
                    'value' => $value,
                ];
                $totalBusRegistration += $value;
                unset($newBusRegistration[$key]);
            }
        }

        $employee->busRegistrationSummary = $newBusRegistration;
        $employee->totalBusRegistration = $totalBusRegistration;
    }

    public function exportBusRegistrationReport(array $attributes)
    {
        $results = $this->busRegistrationSummary($attributes, true);

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

            if (!empty($user->busRegistrationSummary)) {
                foreach ($user->busRegistrationSummary as $item) {
                    if ($values[$item['date']] == 'WK') {
                        $values[$item['date']] = $values[$item['date']] . "," . round($item['value'], 2);
                    } else {

                        $values[$item['date']] = $item['value'] ? round($item['value'], 2) : '_';
                    }
                }
            }

            $params['[[values]]'][] = array_values($values);
            $params['[totalWork]'][] = round($user->totalBusRegistration, 2);
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
                        $merge = $mergeCoordinate[$key - 1] . ":" . $mergeCoordinate[$key];
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
                $merge = $cell_coordinate . ":" . $mergeCol;

                $listMerge[] = $merge;

            },
            '{sign}' => function (CallbackParam $param) use (&$listMerge) {
                $sheet = $param->sheet;
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ":" . $mergeCol;

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

                $merge = $mergeColFirst . ":" . $mergeColEnd;

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

        return $this->excelExporterServices->export('bus_registrations', $params, $callbacks, $events);
    }
}
