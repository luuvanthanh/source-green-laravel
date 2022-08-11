<?php

namespace GGPHP\Report\Services;

use alhimik1986\PhpExcelTemplator\params\CallbackParam;
use alhimik1986\PhpExcelTemplator\PhpExcelTemplator;
use Carbon\Carbon;
use GGPHP\Camera\Models\Camera;
use GGPHP\Category\Models\EventType;
use GGPHP\Category\Models\TouristDestination;
use GGPHP\Event\Models\Event;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\NumberOfTourist\Models\NumberOfTourist;
use GGPHP\TourGuide\Models\TourGuide;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ReportService
{

    //báo cáo chung
    public static function generalReport($attributes)
    {
        switch ($attributes['report_type']) {
            case 'DATE':
                $begin = new \DateTime($attributes['start_time']);
                $end = new \DateTime($attributes['end_time']);
                $intervalDate = \DateInterval::createFromDateString('1 day');
                $end->modify('+1 day');
                $periodDate = new \DatePeriod($begin, $intervalDate, $end);

                //event behavior
                $attributes['event_code'] = 'RAC,BHR';
                $eventBehavior = self::reportNumberEventBehaviorByTouristDestination($attributes, $periodDate, 'Y-m-d');

                //event warning
                $attributes['event_code'] = null;
                $eventWarning = self::reportWarningEvent($attributes, $periodDate, 'Y-m-d');

                //event object
                $attributes['event_code'] = 'HDVHP,HDVBHP';
                $eventObject = self::reportNumberEventObject($attributes, $periodDate, 'Y-m-d');

                //number_of_guest
                $numberOfGuest = self::reportNumberOfGuest($attributes, $periodDate, 'Y-m-d');
                break;
            case 'MONTH':
                $begin = new \DateTime($attributes['start_time']);
                $end = new \DateTime($attributes['end_time']);
                $intervalDate = \DateInterval::createFromDateString('first day of next month');
                $end->modify('+1 day');
                $periodDate = new \DatePeriod($begin, $intervalDate, $end);

                //event behavior
                $attributes['event_code'] = 'RAC,BHR';
                $eventBehavior = self::reportNumberEventBehaviorByTouristDestination($attributes, $periodDate, 'Y-m-d');

                //event warning
                $attributes['event_code'] = null;
                $eventWarning = self::reportWarningEvent($attributes, $periodDate, 'Y-m-d');

                //event object
                $attributes['event_code'] = 'HDVHP,HDVBHP';
                $eventObject = self::reportNumberEventObject($attributes, $periodDate, 'Y-m-d');

                //number_of_guest
                $numberOfGuest = self::reportNumberOfGuest($attributes, $periodDate, 'Y-m-d');

                break;
        }

        return [
            'number_of_guest' => $numberOfGuest['number_of_guest'],
            'number_of_guest_max' => $numberOfGuest['number_of_guest_max'],
            'data_event_behavior' =>  $eventBehavior,
            'data_event_object' =>  $eventObject,
            'data_event_warning' =>  $eventWarning
        ];
    }

    public static function numberEventReportBehavior($attributes)
    {

        switch ($attributes['report_type']) {
            case 'DATE':
                $begin = new \DateTime($attributes['start_time']);
                $end = new \DateTime($attributes['end_time']);
                $intervalDate = \DateInterval::createFromDateString('1 day');
                $end->modify('+1 day');
                $periodDate = new \DatePeriod($begin, $intervalDate, $end);

                //event
                $event = self::reportNumberEventBehavior($attributes, $periodDate, 'Y-m-d');
                break;
            case 'MONTH':
                $begin = new \DateTime($attributes['start_time']);
                $end = new \DateTime($attributes['end_time']);
                $intervalDate = \DateInterval::createFromDateString('first day of next month');
                $end->modify('+1 day');
                $periodDate = new \DatePeriod($begin, $intervalDate, $end);

                //event
                $event = self::reportNumberEventBehavior($attributes, $periodDate, 'Y-m');
                break;
            case 'YEAR':
                $begin = new \DateTime($attributes['start_time']);
                $end = new \DateTime($attributes['end_time']);
                $intervalDate = \DateInterval::createFromDateString('first day of next year');
                $end->modify('+1 day');
                $periodDate = new \DatePeriod($begin, $intervalDate, $end);

                //event
                $event = self::reportNumberEventBehavior($attributes, $periodDate, 'Y');
                break;
        }

        return $event;
    }

    public static function numberEventReportObject($attributes)
    {

        switch ($attributes['report_type']) {
            case 'DATE':
                $begin = new \DateTime($attributes['start_time']);
                $end = new \DateTime($attributes['end_time']);
                $intervalDate = \DateInterval::createFromDateString('1 day');
                $end->modify('+1 day');
                $periodDate = new \DatePeriod($begin, $intervalDate, $end);

                //event
                $event = self::reportNumberEventObject($attributes, $periodDate, 'Y-m-d');
                break;
            case 'MONTH':
                $begin = new \DateTime($attributes['start_time']);
                $end = new \DateTime($attributes['end_time']);
                $intervalDate = \DateInterval::createFromDateString('first day of next month');
                $end->modify('+1 day');
                $periodDate = new \DatePeriod($begin, $intervalDate, $end);

                //event
                $event = self::reportNumberEventObject($attributes, $periodDate, 'Y-m');
                break;
            case 'YEAR':
                $begin = new \DateTime($attributes['start_time']);
                $end = new \DateTime($attributes['end_time']);
                $intervalDate = \DateInterval::createFromDateString('first day of next year');
                $end->modify('+1 day');
                $periodDate = new \DatePeriod($begin, $intervalDate, $end);

                //event
                $event = self::reportNumberEventObject($attributes, $periodDate, 'Y');
                break;
        }

        return $event;
    }

    public static function warningReport($attributes)
    {
        //event
        $eventTypes = EventType::query();

        if (!empty($attributes['event_code'])) {
            $eventTypes->whereIn('code', explode(',', $attributes['event_code']));
        }

        $eventTypes = $eventTypes->get();
        $data = [];

        foreach ($eventTypes as $key => $item) {
            $events = 0;
            $events = Event::where('event_type_id', $item->id)
                ->where('time', '>=', $attributes['start_time'])
                ->where('time', '<=', $attributes['end_time']);

            if (!empty($attributes['tourist_destination_id'])) {
                $touristDestinationId = explode(',', $attributes['tourist_destination_id']);
                $events->whereIn('tourist_destination_id', $touristDestinationId);
            }

            $events = $events->count();
            $eventMistakes = Event::where('event_type_id', $item->id)
                ->where('status_detail', Event::STATUS_DETAIL['MISTAKE'])
                ->where('time', '>=', $attributes['start_time'])
                ->where('time', '<=', $attributes['end_time']);

            if (!empty($attributes['tourist_destination_id'])) {
                $touristDestinationId = explode(',', $attributes['tourist_destination_id']);
                $eventMistakes->whereIn('tourist_destination_id', $touristDestinationId);
            }

            $eventMistakes = $eventMistakes->count();
            $falseRecognitionRate = 0;

            if ($events > 0) {
                $falseRecognitionRate = ($eventMistakes / $events) * 100;
            }

            $data[] = [
                'event_name' => $item->name,
                'event_code' => $item->code,
                'total_event_warning' => $events,
                'total_event_mistake' => $eventMistakes,
                'false_recognition_rate' => $falseRecognitionRate,
                'correct_recognition_rate' => 100 - $falseRecognitionRate,
            ];
        }

        return $data;
    }

    // báo cáo tần suất
    public static function frequencyOfAppearanceReport($attributes)
    {
        $begin =  Carbon::parse($attributes['start_time']);
        $end =  Carbon::parse($attributes['end_time']);

        $diffDate = $begin->diffInDays($end);
        $reportFrequencyOfAppearance = self::reportFrequencyOfAppearance($attributes, $diffDate);

        return $reportFrequencyOfAppearance;
    }

    //func
    public static function reportNumberEventBehavior($attributes, $periodDate, $formatTime = 'Y-m-d')
    {
        $data = [];

        $eventTypes = EventType::query();

        if (!empty($attributes['event_code'])) {
            $eventTypes->whereIn('code', explode(',', $attributes['event_code']));
        }

        $eventTypes = $eventTypes->get();

        foreach ($eventTypes as $key => $item) {
            $touristDestination =  TouristDestination::query();

            if (!empty($attributes['tourist_destination_id'])) {
                $touristDestination->whereIn('id', explode(',', $attributes['tourist_destination_id']));
            }

            $dataByTime = [];
            $dataByTouristDestinations = [];
            $total = 0;
            $touristDestinations = $touristDestination->get();

            foreach ($periodDate as $key => $date) {
                $dataBytouristDestination = [];
                $totalDate = 0;
                foreach ($touristDestinations as $key => $value) {
                    $events = 0;

                    switch ($attributes['report_type']) {
                        case 'DATE':
                            $events = Event::where('tourist_destination_id', $value->id)
                                ->where('event_type_id', $item->id)
                                ->whereDate('time', $date->format('Y-m-d'))->count();
                            break;
                        case 'MONTH':
                            $events = Event::where('tourist_destination_id', $value->id)
                                ->where('event_type_id', $item->id)
                                ->whereMonth('time', $date->format('m'))
                                ->whereYear('time', $date->format('Y'))->count();
                            break;
                        case 'YEAR':
                            $events = Event::where('tourist_destination_id', $value->id)
                                ->where('event_type_id', $item->id)
                                ->whereYear('time', $date->format('Y'))->count();
                            break;
                    }

                    if ($events == 0) {
                        continue;
                    }

                    $total += $events;
                    $totalDate += $events;
                    $dataBytouristDestination[] = [
                        'name' => $value->name,
                        'number' => $events
                    ];

                    if (array_key_exists($value->name, $dataByTouristDestinations)) {
                        $dataByTouristDestinations[$value->name] +=  $events;
                    } else {
                        $dataByTouristDestinations[$value->name] =  $events;
                    }
                }


                if ($totalDate == 0) {
                    continue;
                }

                $dataByTime[] = [
                    'time' => $date->format($formatTime),
                    'total_time' => $totalDate,
                    'tourist_destination' => $dataBytouristDestination
                ];
            }


            $data[] = [
                'event_name' => $item->name,
                'event_code' => $item->code,
                'total' => $total,
                'data_by_time' => $dataByTime,
                'dataByTouristDestinations' => $dataByTouristDestinations
            ];
        }


        return $data;
    }

    public static function reportNumberEventBehaviorByTouristDestination($attributes, $periodDate, $formatTime = 'Y-m-d')
    {
        $data = [];

        $eventTypes = EventType::query();

        if (!empty($attributes['event_code'])) {
            $eventTypes->whereIn('code', explode(',', $attributes['event_code']));
        }

        $eventTypes = $eventTypes->get();

        foreach ($eventTypes as $key => $item) {
            $touristDestination =  TouristDestination::query();

            if (!empty($attributes['tourist_destination_id'])) {
                $touristDestination->whereIn('id', explode(',', $attributes['tourist_destination_id']));
            }

            $total = 0;
            $touristDestinations = $touristDestination->get();

            $dataBytouristDestination = [];

            foreach ($touristDestinations as $key => $value) {
                $events = 0;

                switch ($attributes['report_type']) {
                    case 'DATE':
                        $events = Event::where('tourist_destination_id', $value->id)
                            ->where('event_type_id', $item->id)
                            ->where('time', '>=', $attributes['start_time'])
                            ->where('time', '<=', $attributes['end_time'])->count();
                        break;
                    case 'MONTH':
                        $startTime = Carbon::parse($attributes['start_time'])->startOfMonth();
                        $endTime = Carbon::parse($attributes['end_time'])->endOfMonth();

                        $events = Event::where('tourist_destination_id', $value->id)
                            ->where('event_type_id', $item->id)
                            ->where('time', '>=', $startTime)
                            ->where('time', '<=', $endTime)->count();
                        break;
                    case 'YEAR':
                        $startTime = Carbon::parse($attributes['start_time'])->startOfYear();
                        $endTime = Carbon::parse($attributes['end_time'])->endOfYear();
                        $events = Event::where('tourist_destination_id', $value->id)
                            ->where('event_type_id', $item->id)
                            ->where('time', '>=', $startTime)
                            ->where('time', '<=', $endTime)->count();
                        break;
                }

                if ($events == 0) {
                    continue;
                }

                $total += $events;
                $dataBytouristDestination[] = [
                    'name' => $value->name,
                    'number' => $events
                ];
            }

            $data[] = [
                'event_name' => $item->name,
                'event_code' => $item->code,
                'total' => $total,
                'data_by_tourist_destination' => $dataBytouristDestination
            ];
        }


        return $data;
    }

    //func
    public static function reportNumberEventObject($attributes, $periodDate, $formatTime = 'Y-m-d')
    {
        $data = [];

        $eventTypes = EventType::query();

        if (!empty($attributes['event_code'])) {
            $eventTypes->whereIn('code', explode(',', $attributes['event_code']));
        }

        $eventTypes = $eventTypes->get();

        foreach ($eventTypes as $key => $item) {
            $touristDestination =  TouristDestination::query();

            if (!empty($attributes['tourist_destination_id'])) {
                $touristDestination->whereIn('id', explode(',', $attributes['tourist_destination_id']));
            }

            $dataByTime = [];
            $total = 0;
            $touristDestinations = $touristDestination->get();

            foreach ($periodDate as $key => $date) {
                $dataBytouristDestination = [];
                $totalDate = 0;
                foreach ($touristDestinations as $key => $value) {
                    $events = 0;
                    switch ($attributes['report_type']) {
                        case 'DATE':
                            $events = TourGuide::whereHas('event', function ($query) use ($value, $item, $date) {
                                $query->where('tourist_destination_id', $value->id)
                                    ->where('event_type_id', $item->id)
                                    ->whereDate('time', $date->format('Y-m-d'));
                            })->count();
                            break;
                        case 'MONTH':
                            $events = TourGuide::whereHas('event', function ($query) use ($value, $item, $date) {
                                $query->where('tourist_destination_id', $value->id)
                                    ->where('event_type_id', $item->id)
                                    ->whereMonth('time', $date->format('m'))
                                    ->whereYear('time', $date->format('Y'));
                            })->count();

                            break;
                        case 'YEAR':
                            $events = TourGuide::whereHas('event', function ($query) use ($value, $item, $date) {
                                $query->where('tourist_destination_id', $value->id)
                                    ->where('event_type_id', $item->id)
                                    ->whereYear('time', $date->format('Y'));
                            })->count();
                            break;
                    }

                    if ($events == 0) {
                        continue;
                    }

                    $total += $events;
                    $totalDate += $events;
                    $dataBytouristDestination[] = [
                        'name' => $value->name,
                        'number' => $events
                    ];
                }


                if ($totalDate == 0) {
                    continue;
                }

                $dataByTime[] = [
                    'time' => $date->format($formatTime),
                    'total_time' => $totalDate,
                    'tourist_destination' => $dataBytouristDestination
                ];
            }


            $data[] = [
                'event_name' => $item->name,
                'event_code' => $item->code,
                'total' => $total,
                'data_by_time' => $dataByTime
            ];
        }


        return $data;
    }

    //func
    public static function reportNumberOfGuest($attributes, $periodDate, $formatTime = 'Y-m-d')
    {

        $touristDestination =  TouristDestination::query();

        if (!empty($attributes['tourist_destination_id'])) {
            $touristDestination->whereIn('id', explode(',', $attributes['tourist_destination_id']));
        }

        $dataByTime = [];
        $touristDestinations = $touristDestination->get();
        $numberOfGuestMax = collect();

        foreach ($periodDate as $key => $date) {
            $dataBytouristDestination = [];
            $totalTime = 0;

            foreach ($touristDestinations as $key => $value) {
                $numberOfTourists = 0;
                switch ($attributes['report_type']) {
                    case 'DATE':
                        $numberOfTourists = NumberOfTourist::whereDate('time', $date->format('Y-m-d'))
                            ->where('tourist_destination_id', $value->id)
                            ->sum(\DB::raw('number_of_guest_out + number_of_guest_in'));
                        break;
                    case 'MONTH':
                        $numberOfTourists = NumberOfTourist::whereMonth('time', $date->format('m'))
                            ->whereYear('time', $date->format('Y'))
                            ->where('tourist_destination_id', $value->id)
                            ->sum(\DB::raw('number_of_guest_out + number_of_guest_in'));
                        break;
                    case 'YEAR':
                        $numberOfTourists = NumberOfTourist::whereYear('time', $date->format('Y'))
                            ->where('tourist_destination_id', $value->id)
                            ->sum(\DB::raw('number_of_guest_out + number_of_guest_in'));
                        break;
                }

                if ($numberOfTourists == 0) {
                    continue;
                }

                $numberOfGuestMax->push([
                    'time' =>  $date->format($formatTime),
                    'name' => $value->name,
                    'number_of_guest' => $numberOfTourists
                ]);

                $totalTime += $numberOfTourists;
                $dataBytouristDestination[] = [
                    'name' => $value->name,
                    'number_of_guest' => $numberOfTourists
                ];
            }

            if ($totalTime == 0) {
                continue;
            }

            $dataByTime[] = [
                'time' => $date->format($formatTime),
                'number_of_guest' => $totalTime,
                'tourist_destination' => $dataBytouristDestination
            ];
        }

        return [
            'number_of_guest' => $dataByTime,
            'number_of_guest_max' => $numberOfGuestMax->sortByDesc('number_of_guest')->take(5)->toArray()
        ];
    }

    //func
    public static function reportFrequencyOfAppearance($attributes, $diffDate)
    {

        $data = [];

        if ($diffDate <= 31) {
            $tourGuides = TourGuide::withCount(['event' => function ($query) use ($attributes) {
                if (!empty($attributes['tourist_destination_id'])) {
                    $query->whereIn('tourist_destination_id', explode(',', $attributes['tourist_destination_id']));
                }
            }])->has('event', '>', 0)->orderBy('event_count', 'desc');

            if (!empty($attributes['type'])) {
                $tourGuides->where('type', TourGuide::TYPE[$attributes['type']]);
            };

            $tourGuides = $tourGuides->get();
            $dataCount = $tourGuides->groupBy('event_count')->map->count()->toArray();

            ksort($dataCount);
            foreach ($dataCount as $key => $value) {
                $data[] = [
                    'milestones' => $key,
                    'value' => $value
                ];
            }
        } else {
            $arrayMilestones = [
                [
                    'start' => 1,
                    'end' => 2
                ],
                [
                    'start' => 3,
                    'end' => 5
                ],
                [
                    'start' => 6,
                    'end' => 10
                ],
                [
                    'start' => 11,
                    'end' => 20
                ],
                [
                    'start' => 21,
                    'end' => 30
                ],
                [
                    'start' => 31,
                    'end' => 45
                ],
                [
                    'start' => 46,
                    'end' => 60
                ],
                [
                    'start' => 61,
                    'end' => 80
                ],
                [
                    'start' => 81,
                    'end' => 100
                ],
                [
                    'start' => 101,
                    'end' => null
                ]
            ];

            foreach ($arrayMilestones as $item) {
                $tourGuides = TourGuide::withCount(['event' => function ($query) use ($attributes) {
                    if (!empty($attributes['tourist_destination_id'])) {
                        $query->whereIn('tourist_destination_id', explode(',', $attributes['tourist_destination_id']));
                    }
                }])->has('event', '>=', $item['start']);

                if (!empty($attributes['type'])) {
                    $tourGuides->where('type', TourGuide::TYPE[$attributes['type']]);
                };

                $end = null;
                if (!is_null($item['end'])) {
                    $end =  '-' . $item['end'];
                    $tourGuides->has('event', '<=', $item['end']);
                }

                $tourGuides = $tourGuides->orderBy('event_count', 'desc')->count();


                $data[] = [
                    'milestones' => $item['start'] . $end,
                    'value' => $tourGuides
                ];
            }
        }

        return $data;
    }

    //func
    public static function reportWarningEvent($attributes, $periodDate, $formatTime = 'Y-m-d')
    {
        $data = [];
        $touristDestination =  TouristDestination::query();

        if (!empty($attributes['tourist_destination_id'])) {
            $touristDestination->whereIn('id', explode(',', $attributes['tourist_destination_id']));
        }

        $touristDestinations = $touristDestination->get();
        $total = 0;
        $data = [];

        foreach ($touristDestinations as $key => $value) {
            $events = 0;

            switch ($attributes['report_type']) {
                case 'DATE':
                    $events = Event::where('tourist_destination_id', $value->id)
                        ->where('time', '>=', $attributes['start_time'])
                        ->where('time', '<=', $attributes['end_time'])->count();
                    break;
                case 'MONTH':
                    $startTime = Carbon::parse($attributes['start_time'])->startOfMonth();
                    $endTime = Carbon::parse($attributes['end_time'])->endOfMonth();

                    $events = Event::where('tourist_destination_id', $value->id)
                        ->where('time', '>=', $startTime)
                        ->where('time', '<=', $endTime)->count();
                    break;
                case 'YEAR':
                    $startTime = Carbon::parse($attributes['start_time'])->startOfYear();
                    $endTime = Carbon::parse($attributes['end_time'])->endOfYear();
                    $events = Event::where('tourist_destination_id', $value->id)
                        ->where('time', '>=', $startTime)
                        ->where('time', '<=', $endTime)->count();
                    break;
            }

            if ($events == 0) {
                continue;
            }

            $total += $events;
            $data[] = [
                'name' => $value->name,
                'number' => $events
            ];
        }

        return [
            'total' => $total,
            'detail' => $data
        ];
    }

    public static function cameraStatusReport($attributes)
    {
        $data = [];
        $touristDestination =  TouristDestination::query();

        if (!empty($attributes['tourist_destination_id'])) {
            $touristDestination->whereIn('id', explode(',', $attributes['tourist_destination_id']));
        }

        $touristDestinations = $touristDestination->get();

        $total = 0;
        $totalRunning = 0;
        $totalFail = 0;
        $data = [];

        foreach ($touristDestinations as $key => $value) {
            $cameraRunning = Camera::where('tourist_destination_id', $value->id)
                ->whereIn('status', [Camera::STATUS['STATUS_RUNNING']])->get();
            $cameraFailed = Camera::where('tourist_destination_id', $value->id)
                ->whereIn('status', [Camera::STATUS['STATUS_FAILED']])->get();

            $countCameraRunning = count($cameraRunning);
            $countCameraFailed = count($cameraFailed);

            $totalRunning += $countCameraRunning;
            $totalFail += $countCameraFailed;
            $total += $countCameraRunning + $countCameraFailed;
            $data[] = [
                'name' => $value->name,
                'number_running' => $countCameraRunning,
                'number_failed' => $countCameraFailed,
                'list_cam_run' => $cameraRunning,
                'list_cam_faild' => $cameraFailed
            ];
        }

        return [
            'total' => $total,
            'total_running' => $totalRunning,
            'total_fail' => $totalFail,
            'detail' => $data
        ];
    }

    public static function frequencyOfBusinessReport($attributes)
    {
        $begin =  Carbon::parse($attributes['start_time']);
        $end =  Carbon::parse($attributes['end_time']);

        $diffDate = $begin->diffInDays($end);

        $data = [];

        if ($diffDate <= 31) {
            $tourGuides = TourGuide::has('travelAgencieTourGuide')->withCount(['event' => function ($query) use ($attributes) {
                if (!empty($attributes['tourist_destination_id'])) {
                    $query->whereIn('tourist_destination_id', explode(',', $attributes['tourist_destination_id']));
                }
            }])->has('event', '>', 0)->orderBy('event_count', 'desc');

            if (!empty($attributes['type'])) {
                $tourGuides->where('type', TourGuide::TYPE[$attributes['type']]);
            };

            $tourGuides = $tourGuides->get();
            $dataCount = $tourGuides->groupBy('event_count')->map->count()->toArray();

            ksort($dataCount);

            foreach ($dataCount as $key => $value) {
                $data[] = [
                    'milestones' => $key,
                    'value' => $value
                ];
            }
        } else {
            $arrayMilestones = [
                [
                    'start' => 1,
                    'end' => 2
                ],
                [
                    'start' => 3,
                    'end' => 5
                ],
                [
                    'start' => 6,
                    'end' => 10
                ],
                [
                    'start' => 11,
                    'end' => 20
                ],
                [
                    'start' => 21,
                    'end' => 30
                ],
                [
                    'start' => 31,
                    'end' => 45
                ],
                [
                    'start' => 46,
                    'end' => 60
                ],
                [
                    'start' => 61,
                    'end' => 80
                ],
                [
                    'start' => 81,
                    'end' => 100
                ],
                [
                    'start' => 101,
                    'end' => null
                ]
            ];

            foreach ($arrayMilestones as $item) {
                $tourGuides = TourGuide::has('travelAgencieTourGuide')->withCount(['event' => function ($query) use ($attributes) {
                    if (!empty($attributes['tourist_destination_id'])) {
                        $query->whereIn('tourist_destination_id', explode(',', $attributes['tourist_destination_id']));
                    }
                }])->has('event', '>=', $item['start']);

                if (!empty($attributes['type'])) {
                    $tourGuides->where('type', TourGuide::TYPE[$attributes['type']]);
                };

                $end = null;
                if (!is_null($item['end'])) {
                    $end =  '-' . $item['end'];
                    $tourGuides->has('event', '<=', $item['end']);
                }

                $tourGuides = $tourGuides->orderBy('event_count', 'desc')->count();


                $data[] = [
                    'milestones' => $item['start'] . $end,
                    'value' => $tourGuides
                ];
            }
        }

        return $data;
    }

    public static function numberEventReportObjectExport($attributes)
    {
        $data = self::numberEventReportObject($attributes);

        $params = [];

        $touristDestination = [];
        foreach ($data[0]['data_by_time'] as $value) {

            $params['[time]'][] = $value['time'];
            $valueParam = [];

            foreach ($value['tourist_destination'] as $key => $item) {
                $valueParam[] = $item['number'];
                if (!array_key_exists($item['name'], $touristDestination)) {
                    $touristDestination[$item['name']] = $item['name'];
                }
            }

            $params['[[value]]'][] = array_values($valueParam);
        }

        $params['[[tourist_destination]]'][] = array_values($touristDestination);

        return  resolve(ExcelExporterServices::class)->export('rp_sl_hdvhp', $params);
    }

    public static function numberEventReportBehaviorExport($attributes)
    {
        $reports = self::numberEventReportBehavior($attributes);

        $params = [];

        $tourist_destination = [];
        $column = [];
        $total = [];
        foreach ($reports[0]['data_by_time'] as  $item) {
            $value = [];
            // dd($item);
            foreach ($item['tourist_destination'] as $touristDestination) {

                $value[] = $touristDestination['number'];
                $value[] = ($touristDestination['number'] / $reports[0]['dataByTouristDestinations'][$touristDestination['name']]) * 100;

                if (!array_key_exists($touristDestination['name'], $tourist_destination)) {
                    $tourist_destination[$touristDestination['name']] = $touristDestination['name'];
                    $tourist_destination[] = $touristDestination['name'];
                    $column[] = 'Số lượng du khách';
                    $column[] = 'Tỷ lệ trên tổng (%)';
                    $total[] = $reports[0]['dataByTouristDestinations'][$touristDestination['name']];
                    $total[] = 100;
                }
            }

            $params['[time]'][] = Carbon::parse($item['time'])->format('d-m-Y');
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

        return  resolve(ExcelExporterServices::class)->export('rp_sl_hanh_vi', $params, $callbacks, $events);
    }

    public static function warningReportExport($attributes)
    {
        $reports = self::warningReport($attributes);

        $params = [];
        foreach ($reports as $key => $value) {
            $params['[number]'][] = ++$key;
            $params['[event_name]'][] = $value['event_name'];
            $params['[total_event_warning]'][] = $value['total_event_warning'];
            $params['[total_event_mistake]'][] = $value['total_event_mistake'];
            $params['[false_recognition_rate]'][] = $value['false_recognition_rate'];
            $params['[correct_recognition_rate]'][] = $value['correct_recognition_rate'];
        }

        return resolve(ExcelExporterServices::class)->export('rp_warning', $params);
    }
}
