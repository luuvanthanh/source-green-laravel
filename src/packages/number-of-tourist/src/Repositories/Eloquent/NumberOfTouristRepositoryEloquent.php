<?php

namespace GGPHP\NumberOfTourist\Repositories\Eloquent;

use alhimik1986\PhpExcelTemplator\params\CallbackParam;
use alhimik1986\PhpExcelTemplator\PhpExcelTemplator;
use Carbon\Carbon;
use GGPHP\Camera\Models\Camera;
use GGPHP\Category\Models\TouristDestination;
use GGPHP\Event\Models\Event;
use GGPHP\EventConfig\Models\EventConfig;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\Notification\Models\Notification;
use GGPHP\Notification\Services\NotificationService;
use GGPHP\NumberOfTourist\Events\NumberOfTouristCreateEvent;
use GGPHP\NumberOfTourist\Models\NumberOfTourist;
use GGPHP\NumberOfTourist\Models\NumberOfTouristHandle;
use GGPHP\NumberOfTourist\Presenters\NumberOfTouristPresenter;
use GGPHP\NumberOfTourist\Repositories\Contracts\NumberOfTouristRepository;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class NumberOfTouristRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class NumberOfTouristRepositoryEloquent extends BaseRepository implements NumberOfTouristRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'id',
        'create_at',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return NumberOfTourist::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return NumberOfTouristPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function report($attributes)
    {

        switch ($attributes['report_type']) {
            case 'HOUR':
                $dataEventTrash = [];
                $dataEventHawker = [];
                $dataEventObjectToBeTracked  = [];
                $dataEventGuidingBehavior  = []; 
                $dataEventDoubtfulTourGuide  = [];
                $dataEventIllegalTourGuide  = [];
                $dataEventLawfulTourGuide  = [];
                $startTime = Carbon::now()->setHour($attributes['start_time'])->setMinute('00')->setSecond('00');
                $endTime = Carbon::now()->setHour($attributes['end_time'])->setMinute('00')->setSecond('00');
                $numberOfTourist = NumberOfTourist::query();
                if (!empty($attributes['tourist_destination_id'])) {
                    $numberOfTourist->whereIn('tourist_destination_id', explode(',', $attributes['tourist_destination_id']));
                }
                $data = [];
                $dataTouristDestination = [];
                $numberOfTourists = $numberOfTourist->where('time', '>=', $startTime)->where('time', '<=', $endTime)->get();

                foreach ($numberOfTourists as $numberOfTourist) {
                    $hours = (int)Carbon::parse($numberOfTourist->time)->format('H');

                    if (array_key_exists($numberOfTourist->touristDestination->name, $dataTouristDestination)) {
                        $dataTouristDestination[$numberOfTourist->touristDestination->name] +=  $numberOfTourist->number_of_guest_in;
                    } else {
                        $dataTouristDestination[$numberOfTourist->touristDestination->name] =  $numberOfTourist->number_of_guest_in;
                    }

                    if (!array_key_exists($hours, $data)) {
                        $data[$hours] = [
                            'time' => $hours,
                            'number_of_guest' => $numberOfTourist->number_of_guest_in,
                            'tourist_destination' => [
                                $numberOfTourist->touristDestination->name => [
                                    'name' => $numberOfTourist->touristDestination->name,
                                    'number_of_guest' => $numberOfTourist->number_of_guest_in
                                ]
                            ]
                        ];
                    } else {
                        $data[$hours]['number_of_guest'] += $numberOfTourist->number_of_guest_in;

                        if (!array_key_exists($numberOfTourist->touristDestination->name, $data[$hours]['tourist_destination'])) {
                            $data[$hours]['tourist_destination'][$numberOfTourist->touristDestination->name] = [
                                'name' => $numberOfTourist->touristDestination->name,
                                'number_of_guest' => $numberOfTourist->number_of_guest_in

                            ];
                        } else {
                            $data[$hours]['tourist_destination'][$numberOfTourist->touristDestination->name]['number_of_guest'] += $numberOfTourist->number_of_guest_in;
                        }
                    }
                }
                break;
            case 'DATE':
                $numberOfTourist = NumberOfTourist::query();

                if (!empty($attributes['tourist_destination_id'])) {
                    $numberOfTourist->whereIn('tourist_destination_id', explode(',', $attributes['tourist_destination_id']));
                }
                $data = [];
                $dataTouristDestination = [];
                $numberOfTourists = $numberOfTourist->where('time', '>=', $attributes['start_time'])->where('time', '<=', $attributes['end_time'])->get();
                
                $dataEventTrash = $this->reportEventTrash($attributes);
                $dataEventHawker = $this->reportEventHawker($attributes);
                $dataEventObjectToBeTracked  = $this->reportEventObjectToBeTracked($attributes);
                $dataEventGuidingBehavior  = $this->reportEventGuidingBehavior($attributes);
                $dataEventDoubtfulTourGuide  = $this->reportEventDoubtfulTourGuide($attributes);
                $dataEventIllegalTourGuide  = $this->reportEventIllegalTourGuide($attributes);
                $dataEventLawfulTourGuide  = $this->reportEventLawfulTourGuide($attributes);

                foreach ($numberOfTourists as $numberOfTourist) {
                    $date = Carbon::parse($numberOfTourist->time)->format('Y-m-d');

                    if (array_key_exists($numberOfTourist->touristDestination->name, $dataTouristDestination)) {
                        $dataTouristDestination[$numberOfTourist->touristDestination->name] +=  $numberOfTourist->number_of_guest_in;
                    } else {
                        $dataTouristDestination[$numberOfTourist->touristDestination->name] =  $numberOfTourist->number_of_guest_in;
                    }

                    if (!array_key_exists($date, $data)) {
                        $data[$date] = [
                            'time' => $date,
                            'number_of_guest' => $numberOfTourist->number_of_guest_in,
                            'tourist_destination' => [
                                $numberOfTourist->touristDestination->name => [
                                    'name' => $numberOfTourist->touristDestination->name,
                                    'number_of_guest' => $numberOfTourist->number_of_guest_in
                                ]
                            ]
                        ];
                    } else {
                        $data[$date]['number_of_guest'] += $numberOfTourist->number_of_guest_in;

                        if (!array_key_exists($numberOfTourist->touristDestination->name, $data[$date]['tourist_destination'])) {
                            $data[$date]['tourist_destination'][$numberOfTourist->touristDestination->name] = [
                                'name' => $numberOfTourist->touristDestination->name,
                                'number_of_guest' => $numberOfTourist->number_of_guest_in

                            ];
                        } else {
                            $data[$date]['tourist_destination'][$numberOfTourist->touristDestination->name]['number_of_guest'] += $numberOfTourist->number_of_guest_in;
                        }
                    }
                }

                break;
            case 'MONTH':
                $dataEventTrash = [];
                $dataEventHawker = [];
                $dataEventObjectToBeTracked  = [];
                $dataEventGuidingBehavior  = [];
                $dataEventDoubtfulTourGuide  = [];
                $dataEventIllegalTourGuide  = [];
                $dataEventLawfulTourGuide  = [];
                $startTime = Carbon::parse($attributes['start_time'])->startOfMonth();
                $endTime = Carbon::parse($attributes['end_time'])->endOfMonth();
                $numberOfTourist = NumberOfTourist::query();

                if (!empty($attributes['tourist_destination_id'])) {
                    $numberOfTourist->whereIn('tourist_destination_id', explode(',', $attributes['tourist_destination_id']));
                }
                $data = [];
                $dataTouristDestination = [];
                $numberOfTourists = $numberOfTourist->where('time', '>=', $startTime)->where('time', '<=', $endTime)->get();

                foreach ($numberOfTourists as $numberOfTourist) {
                    $date = Carbon::parse($numberOfTourist->time)->format('Y-m');
                    if (array_key_exists($numberOfTourist->touristDestination->name, $dataTouristDestination)) {
                        $dataTouristDestination[$numberOfTourist->touristDestination->name] +=  $numberOfTourist->number_of_guest_in;
                    } else {
                        $dataTouristDestination[$numberOfTourist->touristDestination->name] =  $numberOfTourist->number_of_guest_in;
                    }

                    if (!array_key_exists($date, $data)) {
                        $data[$date] = [
                            'time' => $date,
                            'number_of_guest' => $numberOfTourist->number_of_guest_in,
                            'tourist_destination' => [
                                $numberOfTourist->touristDestination->name => [
                                    'name' => $numberOfTourist->touristDestination->name,
                                    'number_of_guest' => $numberOfTourist->number_of_guest_in
                                ]
                            ]
                        ];
                    } else {
                        $data[$date]['number_of_guest'] += $numberOfTourist->number_of_guest_in;

                        if (!array_key_exists($numberOfTourist->touristDestination->name, $data[$date]['tourist_destination'])) {
                            $data[$date]['tourist_destination'][$numberOfTourist->touristDestination->name] = [
                                'name' => $numberOfTourist->touristDestination->name,
                                'number_of_guest' => $numberOfTourist->number_of_guest_in

                            ];
                        } else {
                            $data[$date]['tourist_destination'][$numberOfTourist->touristDestination->name]['number_of_guest'] += $numberOfTourist->number_of_guest_in;
                        }
                    }
                }
                break;
            case 'YEAR':
                $dataEventTrash = [];
                $dataEventHawker = [];
                $dataEventObjectToBeTracked  = [];
                $dataEventGuidingBehavior  = [];
                $dataEventDoubtfulTourGuide  = [];
                $dataEventIllegalTourGuide  = [];
                $dataEventLawfulTourGuide  = [];
                $startTime = Carbon::parse($attributes['start_time'])->startOfYear();
                $endTime = Carbon::parse($attributes['end_time'])->endOfYear();
                $numberOfTourist = NumberOfTourist::query();

                if (!empty($attributes['tourist_destination_id'])) {
                    $numberOfTourist->whereIn('tourist_destination_id', explode(',', $attributes['tourist_destination_id']));
                }
                $data = [];
                $numberOfTourists = $numberOfTourist->where('time', '>=', $startTime)->where('time', '<=', $endTime)->get();

                foreach ($numberOfTourists as $numberOfTourist) {
                    $date = Carbon::parse($numberOfTourist->time)->format('Y');

                    if (!array_key_exists($date, $data)) {
                        $data[$date] = [
                            'time' => $date,
                            'number_of_guest' => $numberOfTourist->number_of_guest_in,
                            'tourist_destination' => [
                                $numberOfTourist->touristDestination->name => [
                                    'name' => $numberOfTourist->touristDestination->name,
                                    'number_of_guest' => $numberOfTourist->number_of_guest_in,
                                ]
                            ]
                        ];
                    } else {
                        $data[$date]['number_of_guest'] += $numberOfTourist->number_of_guest_in;

                        if (!array_key_exists($numberOfTourist->touristDestination->name, $data[$date]['tourist_destination'])) {
                            $data[$date]['tourist_destination'][$numberOfTourist->touristDestination->name] = [
                                'name' => $numberOfTourist->touristDestination->name,
                                'number_of_guest' => $numberOfTourist->number_of_guest_in,
                            ];
                        } else {
                            $data[$date]['tourist_destination'][$numberOfTourist->touristDestination->name]['number_of_guest'] += $numberOfTourist->number_of_guest_in;
                        }
                    }
                }
                break;
        }

        return [
            'data' => array_values($data),
            'dataTouristDestination' => $dataTouristDestination,
            'dataEventTrash' => $dataEventTrash,
            'dataEventHawker' => $dataEventHawker,
            'dataEventObjectToBeTracked' => $dataEventObjectToBeTracked,
            'dataEventGuidingBehavior' => $dataEventGuidingBehavior,
            'dataEventDoubtfulTourGuide' => $dataEventDoubtfulTourGuide,
            'dataEventIllegalTourGuide' => $dataEventIllegalTourGuide,
            'dataEventLawfulTourGuide' => $dataEventLawfulTourGuide
        ];
    }

    public function reportEventTrash($attributes)
    {
        $data = [];
        $event = Event::where('time', '>=', $attributes['start_time'])->where('time', '<=', $attributes['end_time']);

        $eventTrashes = $event->whereHas('eventType', function ($query) use ($attributes) {
            $query->where('code', 'RAC');
        })->get();

        foreach ($eventTrashes as $key => $eventTrash) {
            if (!array_key_exists($eventTrash->touristDestination->name, $data)) {
                $data[$eventTrash->touristDestination->name] =  1;
            } else {
                $data[$eventTrash->touristDestination->name] += 1;
            }
        }

        return $data;
    }

    public function reportEventHawker($attributes)
    {
        $data = [];
        $event = Event::where('time', '>=', $attributes['start_time'])->where('time', '<=', $attributes['end_time']);

        $eventHawkers = $event->whereHas('eventType', function ($query) use ($attributes) {
            $query->where('code', 'BHR');
        })->get();

        foreach ($eventHawkers as $key => $eventHawker) {
            if (!array_key_exists($eventHawker->touristDestination->name, $data)) {
                $data[$eventHawker->touristDestination->name] =  1;
            } else {
                $data[$eventHawker->touristDestination->name] += 1;
            }
        }

        return $data;
    }

    public function reportEventObjectToBeTracked($attributes)
    {
        $data = [];
        $event = Event::where('time', '>=', $attributes['start_time'])->where('time', '<=', $attributes['end_time']);

        $eventObjectToBeTracked = $event->whereHas('eventType', function ($query) use ($attributes) {
            $query->where('code', 'BL');
        })->get();

        foreach ($eventObjectToBeTracked as $key => $eventObjectToBeTrack) {
            if (!array_key_exists($eventObjectToBeTrack->touristDestination->name, $data)) {
                $data[$eventObjectToBeTrack->touristDestination->name] =  1;
            } else {
                $data[$eventObjectToBeTrack->touristDestination->name] += 1;
            }
        }

        return $data;
    }

    public function reportEventGuidingBehavior($attributes)
    {
        $data = [];
        $event = Event::where('time', '>=', $attributes['start_time'])->where('time', '<=', $attributes['end_time']);

        $eventGuidingBehaviors = $event->whereHas('eventType', function ($query) use ($attributes) {
            $query->where('code', 'HVHD');
        })->get();

        foreach ($eventGuidingBehaviors as $key => $eventGuidingBehavior) {
            if (!array_key_exists($eventGuidingBehavior->touristDestination->name, $data)) {
                $data[$eventGuidingBehavior->touristDestination->name] =  1;
            } else {
                $data[$eventGuidingBehavior->touristDestination->name] += 1;
            }
        }

        return $data;
    }

    public function reportEventDoubtfulTourGuide($attributes)
    {
        $data = [];
        $event = Event::where('time', '>=', $attributes['start_time'])->where('time', '<=', $attributes['end_time']);

        $eventDoubtfulTourGuides = $event->whereHas('eventType', function ($query) use ($attributes) {
            $query->where('code', 'NNHDV');
        })->get();

        foreach ($eventDoubtfulTourGuides as $key => $eventDoubtfulTourGuide) {
            if (!array_key_exists($eventDoubtfulTourGuide->touristDestination->name, $data)) {
                $data[$eventDoubtfulTourGuide->touristDestination->name] =  1;
            } else {
                $data[$eventDoubtfulTourGuide->touristDestination->name] += 1;
            }
        }

        return $data;
    }

    public function reportEventIllegalTourGuide($attributes)
    {
        $data = [];
        $event = Event::where('time', '>=', $attributes['start_time'])->where('time', '<=', $attributes['end_time']);

        $eventIllegalTourGuides = $event->whereHas('eventType', function ($query) use ($attributes) {
            $query->where('code', 'HDVBHP');
        })->get();

        foreach ($eventIllegalTourGuides as $key => $eventIllegalTourGuide) {
            if (!array_key_exists($eventIllegalTourGuide->touristDestination->name, $data)) {
                $data[$eventIllegalTourGuide->touristDestination->name] =  1;
            } else {
                $data[$eventIllegalTourGuide->touristDestination->name] += 1;
            }
        }

        return $data;
    }

    public function reportEventLawfulTourGuide($attributes)
    {
        $data = [];
        $event = Event::where('time', '>=', $attributes['start_time'])->where('time', '<=', $attributes['end_time']);

        $eventLawfulTourGuides = $event->whereHas('eventType', function ($query) use ($attributes) {
            $query->where('code', 'HDVHP');
        })->get();

        foreach ($eventLawfulTourGuides as $key => $eventLawfulTourGuide) {
            if (!array_key_exists($eventLawfulTourGuide->touristDestination->name, $data)) {
                $data[$eventLawfulTourGuide->touristDestination->name] =  1;
            } else {
                $data[$eventLawfulTourGuide->touristDestination->name] += 1;
            }
        }

        return $data;
    }

    public function create($attributes)
    {
        $camera = Camera::find($attributes['camera_id']);
        $attributes['tourist_destination_id'] = $camera->tourist_destination_id;

        $numberOfTourist = NumberOfTourist::create($attributes);

        broadcast(new NumberOfTouristCreateEvent([
            'date' => Carbon::parse($numberOfTourist->time)->format('Y-m-d'),
            'type' => 'NUMBER_OF_TOURIST_CREATE'
        ]));

        $eventConfig = EventConfig::first();

        if (!is_null($eventConfig)) {
            $configCountTouristDetail = $eventConfig->config_count_tourist['detail'];

            $keyDetail = array_search($numberOfTourist->tourist_destination_id, array_column($configCountTouristDetail, 'tourist_destination_id'));
            if ($keyDetail !== false) {
                $countNumberOfTourist = NumberOfTourist::where('tourist_destination_id', $numberOfTourist->tourist_destination_id)
                    ->whereDate('time', Carbon::parse($numberOfTourist->time)->format('Y-m-d'))
                    ->sum(\DB::raw('number_of_guest_out + number_of_guest_in'));

                if ($countNumberOfTourist > $configCountTouristDetail[$keyDetail]['guest_number_warning']) {
                    $notification = Notification::where('tourist_destination_id', $numberOfTourist->tourist_destination_id)
                        ->whereJsonContains('data->type', 'COUNT_NUMBER_OF_TOURIST')
                        ->whereDate('created_at', Carbon::parse($numberOfTourist->time)->format('Y-m-d'))
                        ->first();

                    if (is_null($notification)) {
                        NotificationService::countNumberOfTourist($numberOfTourist, $configCountTouristDetail[$keyDetail]['guest_number_warning']);
                    }
                }
            } else {

                if ($eventConfig->config_count_tourist['is_apply_all']) {
                    $countNumberOfTourist = NumberOfTourist::where('tourist_destination_id', $numberOfTourist->tourist_destination_id)
                        ->whereDate('time', Carbon::parse($numberOfTourist->time)->format('Y-m-d'))
                        ->sum(\DB::raw('number_of_guest_out + number_of_guest_in'));

                    if ($countNumberOfTourist > $eventConfig->config_count_tourist['guest_number_warning']) {
                        $notification = Notification::where('tourist_destination_id', $numberOfTourist->tourist_destination_id)
                            ->whereJsonContains('data->type', 'COUNT_NUMBER_OF_TOURIST')
                            ->whereDate('created_at', Carbon::parse($numberOfTourist->time)->format('Y-m-d'))
                            ->first();

                        if (is_null($notification)) {
                            NotificationService::countNumberOfTourist($numberOfTourist, $eventConfig->config_count_tourist['guest_number_warning']);
                        }
                    }
                }
            }
        }

        return parent::parserResult($numberOfTourist);
    }
    public function exportExcel($attributes)
    {
        $reports = $this->report($attributes);

        $params = [];

        $tourist_destination = [];
        $column = [];
        $total = [];

        foreach ($reports['data'] as  $item) {
            $value = [];

            foreach ($item['tourist_destination'] as $touristDestination) {
                $value[] = $touristDestination['number_of_guest'];
                $value[] = ($touristDestination['number_of_guest'] / $reports['dataTouristDestination'][$touristDestination['name']]) * 100;

                if (!array_key_exists($touristDestination['name'], $tourist_destination)) {
                    $tourist_destination[$touristDestination['name']] = $touristDestination['name'];
                    $tourist_destination[] = $touristDestination['name'];
                    $column[] = 'Số lượng du khách';
                    $column[] = 'Tỷ lệ trên tổng (%)';
                    $total[] = $reports['dataTouristDestination'][$touristDestination['name']];
                    $total[] = 100;
                }
            }

            $params['[time]'][] = 'Tháng ' . Carbon::parse($item['time'])->format('m/Y');
            $params['[[value]]'][] = array_values($value);
        }

        $params['[[tourist_destination]]'][] = array_values($tourist_destination);
        $params['[[column]]'][] = array_values($column);

        $params['[time]'][]  = 'Tổng';
        $params['[[value]]'][] = $total;
        $params['{c_time}'][] = '';

        $listMerge = [];

        $callbacks = [
            '[[tourist_destination]]' => function (CallbackParam $param) use (&$listMerge) {
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
            '{c_time}' => function (CallbackParam $param)  use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ':' . $mergeCol;

                $listMerge[] = $merge;
                $sheet = $param->sheet;
                $sheet->getCell($cell_coordinate)->setValue('Thời gian');
            },
        ];

        $events = [
            PhpExcelTemplator::AFTER_INSERT_PARAMS => function (Worksheet $sheet, array $templateVarsArr) use (&$listMerge) {
                foreach ($listMerge as $item) {
                    $sheet->mergeCells($item);
                }
            },

        ];

        return  resolve(ExcelExporterServices::class)->export('number_of_tourists', $params, $callbacks, $events);
    }
}
