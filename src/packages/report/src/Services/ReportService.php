<?php

namespace GGPHP\Report\Services;

use Carbon\Carbon;
use GGPHP\Category\Models\EventType;
use GGPHP\Category\Models\TouristDestination;
use GGPHP\Event\Models\Event;
use GGPHP\NumberOfTourist\Models\NumberOfTourist;
use GGPHP\TourGuide\Models\TourGuide;

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
                $attributes['event_code'] = "RAC,BHR";
                $eventBehavior = self::reportNumberEventBehavior($attributes, $periodDate, 'Y-m-d');

                //event object
                $attributes['event_code'] = "HDVHP,HDVBHP";
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
                $attributes['event_code'] = "RAC,BHR";
                $eventBehavior = self::reportNumberEventBehavior($attributes, $periodDate, 'Y-m-d');

                //event object
                $attributes['event_code'] = "HDVHP,HDVBHP";
                $eventObject = self::reportNumberEventObject($attributes, $periodDate, 'Y-m-d');

                //number_of_guest
                $numberOfGuest = self::reportNumberOfGuest($attributes, $periodDate, 'Y-m-d');

                break;
        }

        return [
            "number_of_guest" => $numberOfGuest['number_of_guest'],
            "number_of_guest_max" => $numberOfGuest['number_of_guest_max'],
            "data_event_behavior" =>  $eventBehavior,
            "data_event_object" =>  $eventObject
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
            $eventTypes->whereIn('code', explode(",", $attributes['event_code']));
        }

        $eventTypes = $eventTypes->get();

        foreach ($eventTypes as $key => $item) {
            $touristDestination =  TouristDestination::query();

            if (!empty($attributes['tourist_destination_id'])) {
                $touristDestination->whereIn('id', explode(",", $attributes['tourist_destination_id']));
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
                            $events = Event::where('tourist_destination_id', $value->id)
                                ->where('event_type_id', $item->id)
                                ->whereDate('time', $date->format('Y-m-d'))->count();
                            break;
                        case 'MONTH':
                            $events = Event::where('tourist_destination_id', $value->id)
                                ->where('event_type_id', $item->id)
                                - whereMonth('time', $date->format('m'))
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
                "event_name" => $item->name,
                "event_code" => $item->code,
                "total" => $total,
                "data_by_time" => $dataByTime
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
            $eventTypes->whereIn('code', explode(",", $attributes['event_code']));
        }

        $eventTypes = $eventTypes->get();

        foreach ($eventTypes as $key => $item) {
            $touristDestination =  TouristDestination::query();

            if (!empty($attributes['tourist_destination_id'])) {
                $touristDestination->whereIn('id', explode(",", $attributes['tourist_destination_id']));
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
                                    - whereMonth('time', $date->format('m'))
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
                "event_name" => $item->name,
                "event_code" => $item->code,
                "total" => $total,
                "data_by_time" => $dataByTime
            ];
        }


        return $data;
    }

    //func
    public static function reportNumberOfGuest($attributes, $periodDate, $formatTime = 'Y-m-d')
    {

        $touristDestination =  TouristDestination::query();

        if (!empty($attributes['tourist_destination_id'])) {
            $touristDestination->whereIn('id', explode(",", $attributes['tourist_destination_id']));
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
                    $query->whereIn('tourist_destination_id', explode(",", $attributes['tourist_destination_id']));
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
                    "milestones" => $key,
                    "value" => $value
                ];
            }
        } else {
            $arrayMilestones = [
                [
                    "start" => 1,
                    "end" => 2
                ],
                [
                    "start" => 3,
                    "end" => 5
                ],
                [
                    "start" => 6,
                    "end" => 10
                ],
                [
                    "start" => 11,
                    "end" => 20
                ],
                [
                    "start" => 21,
                    "end" => 30
                ],
                [
                    "start" => 31,
                    "end" => 45
                ],
                [
                    "start" => 46,
                    "end" => 60
                ],
                [
                    "start" => 61,
                    "end" => 80
                ],
                [
                    "start" => 81,
                    "end" => 100
                ],
                [
                    "start" => 101,
                    "end" => null
                ]
            ];

            foreach ($arrayMilestones as $item) {
                $tourGuides = TourGuide::withCount(['event' => function ($query) use ($attributes) {
                    if (!empty($attributes['tourist_destination_id'])) {
                        $query->whereIn('tourist_destination_id', explode(",", $attributes['tourist_destination_id']));
                    }
                }])->has('event', '>=', $item['start']);

                if (!empty($attributes['type'])) {
                    $tourGuides->where('type', TourGuide::TYPE[$attributes['type']]);
                };

                $end = null;
                if (!is_null($item['end'])) {
                    $end =  "-" . $item['end'];
                    $tourGuides->has('event', '<=', $item['end']);
                }

                $tourGuides = $tourGuides->orderBy('event_count', 'desc')->count();


                $data[] = [
                    "milestones" => $item['start'] . $end,
                    "value" => $tourGuides
                ];
            }
        }

        return $data;
    }
}
