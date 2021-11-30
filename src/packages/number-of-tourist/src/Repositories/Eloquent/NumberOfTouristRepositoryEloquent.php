<?php

namespace GGPHP\NumberOfTourist\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Camera\Models\Camera;
use GGPHP\NumberOfTourist\Models\NumberOfTourist;
use GGPHP\NumberOfTourist\Models\NumberOfTouristHandle;
use GGPHP\NumberOfTourist\Presenters\NumberOfTouristPresenter;
use GGPHP\NumberOfTourist\Repositories\Contracts\NumberOfTouristRepository;
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
                $startTime = Carbon::now()->setHour($attributes['start_time'])->setMinute('00')->setSecond('00');
                $endTime = Carbon::now()->setHour($attributes['end_time'])->setMinute('00')->setSecond('00');
                $numberOfTourist = NumberOfTourist::query();
                if (!empty($attributes['tourist_destination_id'])) {
                    $numberOfTourist->whereIn('tourist_destination_id', explode(",", $attributes['tourist_destination_id']));
                }
                $data = [];
                $numberOfTourists = $numberOfTourist->where('time', '>=', $startTime)->where('time', '<=', $endTime)->get();

                foreach ($numberOfTourists as $numberOfTourist) {
                    $hours = (int)Carbon::parse($numberOfTourist->time)->format('H');

                    if (!array_key_exists($hours, $data)) {
                        $data[$hours] = [
                            'time' => $hours,
                            'number_of_guest' => $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out,
                            'tourist_destination' => [
                                $numberOfTourist->touristDestination->name => [
                                    "name" => $numberOfTourist->touristDestination->name,
                                    "number_of_guest" => $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out
                                ]
                            ]
                        ];
                    } else {
                        $data[$hours]['number_of_guest'] += $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out;

                        if (!array_key_exists($numberOfTourist->touristDestination->name, $data[$hours]['tourist_destination'])) {
                            $data[$hours]['tourist_destination'][$numberOfTourist->touristDestination->name] = [
                                "name" => $numberOfTourist->touristDestination->name,
                                "number_of_guest" => $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out

                            ];
                        } else {
                            $data[$hours]['tourist_destination'][$numberOfTourist->touristDestination->name]['number_of_guest'] += $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out;
                        }
                    }
                }
                break;
            case 'DATE':
                $numberOfTourist = NumberOfTourist::query();

                if (!empty($attributes['tourist_destination_id'])) {
                    $numberOfTourist->whereIn('tourist_destination_id', explode(",", $attributes['tourist_destination_id']));
                }
                $data = [];
                $numberOfTourists = $numberOfTourist->where('time', '>=', $attributes['start_time'])->where('time', '<=', $attributes['end_time'])->get();

                foreach ($numberOfTourists as $numberOfTourist) {
                    $date = Carbon::parse($numberOfTourist->time)->format('Y-m-d');

                    if (!array_key_exists($date, $data)) {
                        $data[$date] = [
                            'time' => $date,
                            'number_of_guest' => $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out,
                            'tourist_destination' => [
                                $numberOfTourist->touristDestination->name => [
                                    "name" => $numberOfTourist->touristDestination->name,
                                    "number_of_guest" => $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out
                                ]
                            ]
                        ];
                    } else {
                        $data[$date]['number_of_guest'] += $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out;

                        if (!array_key_exists($numberOfTourist->touristDestination->name, $data[$date]['tourist_destination'])) {
                            $data[$date]['tourist_destination'][$numberOfTourist->touristDestination->name] = [
                                "name" => $numberOfTourist->touristDestination->name,
                                "number_of_guest" => $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out

                            ];
                        } else {
                            $data[$date]['tourist_destination'][$numberOfTourist->touristDestination->name]['number_of_guest'] += $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out;
                        }
                    }
                }
                break;
            case 'MONTH':
                $startTime = Carbon::parse($attributes['start_time'])->startOfMonth();
                $endTime = Carbon::parse($attributes['end_time'])->endOfMonth();
                $numberOfTourist = NumberOfTourist::query();

                if (!empty($attributes['tourist_destination_id'])) {
                    $numberOfTourist->whereIn('tourist_destination_id', explode(",", $attributes['tourist_destination_id']));
                }
                $data = [];
                $numberOfTourists = $numberOfTourist->where('time', '>=', $startTime)->where('time', '<=', $endTime)->get();

                foreach ($numberOfTourists as $numberOfTourist) {
                    $date = Carbon::parse($numberOfTourist->time)->format('Y-m');

                    if (!array_key_exists($date, $data)) {
                        $data[$date] = [
                            'time' => $date,
                            'number_of_guest' => $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out,
                            'tourist_destination' => [
                                $numberOfTourist->touristDestination->name => [
                                    "name" => $numberOfTourist->touristDestination->name,
                                    "number_of_guest" => $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out
                                ]
                            ]
                        ];
                    } else {
                        $data[$date]['number_of_guest'] += $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out;

                        if (!array_key_exists($numberOfTourist->touristDestination->name, $data[$date]['tourist_destination'])) {
                            $data[$date]['tourist_destination'][$numberOfTourist->touristDestination->name] = [
                                "name" => $numberOfTourist->touristDestination->name,
                                "number_of_guest" => $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out

                            ];
                        } else {
                            $data[$date]['tourist_destination'][$numberOfTourist->touristDestination->name]['number_of_guest'] += $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out;
                        }
                    }
                }
                break;
            case 'YEAR':
                $startTime = Carbon::parse($attributes['start_time'])->startOfYear();
                $endTime = Carbon::parse($attributes['end_time'])->endOfYear();
                $numberOfTourist = NumberOfTourist::query();

                if (!empty($attributes['tourist_destination_id'])) {
                    $numberOfTourist->whereIn('tourist_destination_id', explode(",", $attributes['tourist_destination_id']));
                }
                $data = [];
                $numberOfTourists = $numberOfTourist->where('time', '>=', $startTime)->where('time', '<=', $endTime)->get();

                foreach ($numberOfTourists as $numberOfTourist) {
                    $date = Carbon::parse($numberOfTourist->time)->format('Y');

                    if (!array_key_exists($date, $data)) {
                        $data[$date] = [
                            'time' => $date,
                            'number_of_guest' => $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out,
                            'tourist_destination' => [
                                $numberOfTourist->touristDestination->name => [
                                    "name" => $numberOfTourist->touristDestination->name,
                                    "number_of_guest" => $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out,
                                ]
                            ]
                        ];
                    } else {
                        $data[$date]['number_of_guest'] += $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out;

                        if (!array_key_exists($numberOfTourist->touristDestination->name, $data[$date]['tourist_destination'])) {
                            $data[$date]['tourist_destination'][$numberOfTourist->touristDestination->name] = [
                                "name" => $numberOfTourist->touristDestination->name,
                                "number_of_guest" => $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out,
                            ];
                        } else {
                            $data[$date]['tourist_destination'][$numberOfTourist->touristDestination->name]['number_of_guest'] += $numberOfTourist->number_of_guest_in + $numberOfTourist->number_of_guest_out;
                        }
                    }
                }
                break;
        }

        return [
            'data' => $data,
        ];
    }

    public function create($attributes)
    {
        $camera = Camera::find($attributes['camera_id']);
        $attributes['tourist_destination_id'] = $camera->tourist_destination_id;

        $numberOfTourist = NumberOfTourist::create($attributes);

        return parent::parserResult($numberOfTourist);
    }
}
