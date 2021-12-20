<?php

namespace GGPHP\Report\Services;

use Carbon\Carbon;
use GGPHP\Category\Models\EventType;
use GGPHP\Category\Models\TouristDestination;
use GGPHP\Event\Models\Event;
use GGPHP\NumberOfTourist\Models\NumberOfTourist;

class ReportService
{

    public static function generalReport($attributes)
    {

        switch ($attributes['report_type']) {
            case 'DATE':
                $begin = new \DateTime($attributes['start_time']);
                $end = new \DateTime($attributes['end_time']);
                $intervalDate = \DateInterval::createFromDateString('1 day');
                $end->modify('+1 day');
                $periodDate = new \DatePeriod($begin, $intervalDate, $end);

                //event
                $event = self::reportEvent($attributes, $periodDate, 'Y-m-d');

                //number_of_guest
                $numberOfGuest = self::reportNumberOfGuest($attributes, $periodDate, 'Y-m-d');
                break;
            case 'MONTH':
                $begin = new \DateTime($attributes['start_time']);
                $end = new \DateTime($attributes['end_time']);
                $intervalDate = \DateInterval::createFromDateString('first day of next month');
                $end->modify('+1 day');
                $periodDate = new \DatePeriod($begin, $intervalDate, $end);

                //event
                $event = self::reportEvent($attributes, $periodDate, 'Y-m');

                //number_of_guest
                $numberOfGuest = self::reportNumberOfGuest($attributes, $periodDate, 'Y-m');

                break;
        }

        return [
            "number_of_guest" => $numberOfGuest['number_of_guest'],
            "number_of_guest_max" => $numberOfGuest['number_of_guest_max'],
            "data_event" =>  $event
        ];
    }

    public static function reportEvent($attributes, $periodDate, $formatTime = 'Y-m-d')
    {
        $data = [];

        $eventTypes = EventType::query();

        if (!empty($attributes['event_code'])) {
            $eventTypes->where('code', $attributes['event_code']);
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
                    $events = Event::where('tourist_destination_id', $value->id)->where('event_type_id', $item->id)->whereDate('time', $date->format('Y-m-d'))->count();

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
}
