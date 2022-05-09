<?php

namespace GGPHP\TourGuide\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\TourGuide\Jobs\ImportTourGuideJob;
use GGPHP\TourGuide\Models\TourGuide;
use GGPHP\TourGuide\Models\TourGuideAdditionalInformation;
use GGPHP\TourGuide\Presenters\TourGuidePresenter;
use GGPHP\TourGuide\Repositories\Contracts\TourGuideRepository;
use GGPHP\TourGuide\Services\SyncTourGuideService;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class TourGuideRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TourGuideRepositoryEloquent extends BaseRepository implements TourGuideRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'id',
        'name',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return TourGuide::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return TourGuidePresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function getTourGuide(array $attributes, $parse = true)
    {
        if (!empty($attributes['full_name'])) {
            $this->model = $this->model->whereLike('full_name', $attributes['full_name']);
        }

        if (!empty($attributes['id_card'])) {
            $this->model = $this->model->whereLike('id_card', $attributes['id_card']);
        }

        if (!empty($attributes['card_number'])) {
            $this->model = $this->model->whereLike('card_number', $attributes['card_number']);
        }

        if (!empty($attributes['nationality'])) {
            $this->model = $this->model->whereLike('nationality', $attributes['nationality']);
        }

        if (!empty($attributes['object_type_id'])) {
            $this->model = $this->model->where('object_type_id', $attributes['object_type_id']);
        }

        if (!empty($attributes['type'])) {
            $this->model = $this->model->whereIn('type', $attributes['type']);
        }

        if (!empty($attributes['language'])) {
            $this->model = $this->model->whereIn('language_id', explode(',', $attributes['language']));
        }

        if (!empty($attributes['updated_at'])) {
            $this->model = $this->model->where('updated_at', '>=', $attributes['updated_at']);
        }

        if (!empty($attributes['is_image'])) {
            $this->model = $this->model->has('media');
        }

        if (!empty($attributes['travel_agency_id'])) {
            $travelAgencyId = explode(',', $attributes['travel_agency_id']);

            $this->model = $this->model->whereHas('travelAgencieTourGuide', function ($query) use ($travelAgencyId) {
                $query->whereIn('travel_agency_id', $travelAgencyId);
            });
        }

        if (!empty($attributes['start_time']) && !empty($attributes['end_time'])) {

            if (!empty($attributes['report_type'])) {
                switch ($attributes['report_type']) {
                    case 'MONTH':
                        $attributes['start_time'] = Carbon::parse($attributes['start_time'])->startOfMonth();
                        $attributes['end_time'] = Carbon::parse($attributes['end_time'])->endOfMonth();
                        break;
                    case 'YEAR':
                        $attributes['start_time'] = Carbon::parse($attributes['start_time'])->startOfYear();
                        $attributes['end_time'] = Carbon::parse($attributes['end_time'])->endOfYear();
                        break;
                    default:
                        $attributes['start_time'] = Carbon::parse($attributes['start_time']);
                        $attributes['end_time'] = Carbon::parse($attributes['end_time']);
                        break;
                }
            }

            $this->model = $this->model->whereHas('event', function ($query) use ($attributes) {
                $query->whereDate('time', '>=', $attributes['start_time'])->whereDate('time', '<=', $attributes['end_time']);
            })->with(['event' => function ($query) use ($attributes) {
                $query->whereDate('time', '>=', $attributes['start_time'])->whereDate('time', '<=', $attributes['end_time']);
            }]);
        }

        if (!empty($attributes['tourist_destination_id'])) {
            $this->model = $this->model->whereHas('event', function ($query) use ($attributes) {
                $touristDestinationId = explode(',', $attributes['tourist_destination_id']);
                $query->whereIn('tourist_destination_id', $touristDestinationId);
            })->with(['event' => function ($query) use ($attributes) {
                $touristDestinationId = explode(',', $attributes['tourist_destination_id']);
                $query->whereIn('tourist_destination_id', $touristDestinationId);
            }]);
        }

        if (!empty($attributes['count_event']) && $attributes['count_event'] == 'true') {
            $this->model = $this->model->withCount('event');
            if (!empty($attributes['number_count']) && !empty($attributes['condition_count'])) {
                $this->model = $this->model->has('event', $attributes['condition_count'], $attributes['number_count']);
            }
        }

        if (!$parse) {
            return $this->model->get();
        }

        if (empty($attributes['limit'])) {
            $tourGuide = $this->all();
        } else {
            $tourGuide = $this->paginate($attributes['limit']);
        }

        return $tourGuide;
    }

    public function create(array $attributes)
    {
        $tourGuide = $this->model()::create($attributes);

        if (!empty($attributes['avatar'])) {
            $tourGuide->addMediaFromDisk($attributes['avatar']['path'])->usingName($attributes['avatar']['file_name'])->preservingOriginal()->toMediaCollection('avatar');
        }

        if (!empty($attributes['detail'])) {
            $attributes['detail']['tour_guide_id'] = $tourGuide->id;
            $tourGuideAdditionalInformation = TourGuideAdditionalInformation::create($attributes['detail']);

            if (!empty($attributes['detail']['files'])) {
                $tourGuideAdditionalInformation->addMediaToEntity($tourGuideAdditionalInformation, $attributes['detail']['files'], 'files');
            }
        }

        return parent::find($tourGuide->id);
    }

    public function update(array $attributes, $id)
    {
        $tourGuide = $this->model()::findOrFail($id);

        $tourGuide->update($attributes);

        if (!empty($attributes['avatar'])) {
            $tourGuide->addMediaFromDisk($attributes['avatar']['path'])->usingName($attributes['avatar']['file_name'])->preservingOriginal()->toMediaCollection('avatar');
        }

        if (!empty($attributes['detail'])) {
            $tourGuide->tourGuideAdditionalInformation()->delete();
            $attributes['detail']['tour_guide_id'] = $tourGuide->id;
            $tourGuideAdditionalInformation = TourGuideAdditionalInformation::create($attributes['detail']);

            if (!empty($attributes['detail']['files'])) {
                $tourGuideAdditionalInformation->addMediaToEntity($tourGuideAdditionalInformation, $attributes['detail']['files'], 'files');
            }
        }

        return parent::find($id);
    }

    public function exportExcel($attributes)
    {
        $tourGuides = $this->getTourGuide($attributes, false);

        $params = [];

        foreach ($tourGuides as $key => $tourGuide) {
            $params['[number]'][] = ++$key;
            $params['[full_name]'][] = $tourGuide->full_name;
            $params['[id_card]'][] = $tourGuide->id_card;
            $params['[card_type]'][] = !is_null($tourGuide->cardType) ? $tourGuide->cardType->name : null;
            $params['[card_number]'][] = $tourGuide->card_number;
            $params['[language]'][] = !is_null($tourGuide->language) ?  $tourGuide->language->vietnamese_name : null;
            $params['[expiration_date]'][] = !is_null($tourGuide->expiration_date) ?  Carbon::parse($tourGuide->expiration_date)->format('d-m-Y') : null;
        }

        return  resolve(ExcelExporterServices::class)->export('hdvhp', $params);
    }

    public function exportExcelWithCountEvent($attributes)
    {
        $tourGuides = $this->getTourGuide($attributes, false);

        $params = [];

        foreach ($tourGuides as $key => $tourGuide) {
            $params['[number]'][] = ++$key;
            $params['[full_name]'][] = $tourGuide->full_name;
            $params['[card_type]'][] = !is_null($tourGuide->cardType) ? $tourGuide->cardType->name : null;
            $params['[card_number]'][] = $tourGuide->card_number;
            $params['[language]'][] = !is_null($tourGuide->language) ?  $tourGuide->language->vietnamese_name : null;
            $params['[number_event]'][] = !is_null($tourGuide->event_count) ?  $tourGuide->event_count : null;
        }

        return  resolve(ExcelExporterServices::class)->export('sl_hdvhp', $params);
    }

    public function exportWord($id)
    {
        $tourGuide = TourGuide::findOrFail($id);

        $params = [
            'date_now' => Carbon::now()->format('d'),
            'month_now' =>  Carbon::now()->format('m'),
            'year_now' =>  Carbon::now()->format('Y'),
            'full_name' => $tourGuide->full_name,
            'nationality' => is_null($tourGuide->nationality) ? null : $tourGuide->nationality,
            'home_town' => is_null($tourGuide->home_town) ? null : $tourGuide->home_town,
            'resident' => is_null($tourGuide->resident) ? null : $tourGuide->resident,
            'sex' =>  is_null($tourGuide->sex) ? null : $this->getSEX($tourGuide->sex),
            'id_card' => is_null($tourGuide->nationality) ? null : $tourGuide->nationality,
            'classify' => !is_null($tourGuide->objectType) ?  $tourGuide->objectType->name : null,
        ];

        return resolve(WordExporterServices::class)->exportWord('tour_guide', $params);
    }

    public function getSEX($value)
    {
        $result = null;
        switch ($value) {
            case TourGuide::SEX['MALE']:
                $result = 'Nam';
                break;
            case TourGuide::SEX['FEMALE']:
                $result = 'Nữ';
                break;
        }

        return $result;
    }

    public function tourGuidesByImage($attributes, $parse = true)
    {
        if (!empty($attributes['image_url'])) {
            $imageUrl = [];

            foreach (explode(',', $attributes['image_url']) as $value) {
                $imageUrl[] = env('IMAGE_URL') . '/' . $value;
            }

            $response = Http::get(env('AI_URL') . '/watchlist_search_url', [
                'image_url' => implode(',', $imageUrl),
            ]);

            $attributes['object_id'] = null;
            if ($response->successful()) {
                $attributes['object_id'] = json_decode($response->body())->uuid_lis;
            }

            if (is_null($attributes['object_id']) || empty($attributes['object_id'])) {
                return  [
                    'data' => []
                ];
            } else {
                $this->model = $this->model->whereIn('id', $attributes['object_id']);
            }
        }

        if (!empty($attributes['type'])) {
            $this->model = $this->model->whereIn('type', $attributes['type']);
        }

        $this->model = $this->model->whereHas('event', function ($query) use ($attributes) {
            $query->where('time', '>=', $attributes['start_time'])->where('time', '<=', $attributes['end_time']);

            if (!empty($attributes['tourist_destination_id'])) {
                $touristDestinationId = explode(',', $attributes['tourist_destination_id']);
                $query->whereIn('tourist_destination_id', $touristDestinationId);
            }
        })->with(['event' => function ($query) use ($attributes) {
            $query->where('time', '>=', $attributes['start_time'])->where('time', '<=', $attributes['end_time']);

            if (!empty($attributes['tourist_destination_id'])) {
                $touristDestinationId = explode(',', $attributes['tourist_destination_id']);
                $query->whereIn('tourist_destination_id', $touristDestinationId);
            }
        }]);

        if (!$parse) {
            return $this->model->get();
        }

        if (empty($attributes['limit'])) {
            $tourGuide = $this->all();
        } else {
            $tourGuide = $this->paginate($attributes['limit']);
        }

        return $tourGuide;
    }

    public function exportExcelTourGuidesByImage($attributes)
    {
        $tourGuides = $this->tourGuidesByImage($attributes, false);

        $params = [];

        $key = 0;
        foreach ($tourGuides as $key => $tourGuide) {

            foreach ($tourGuide->event as $keyEvent => $event) {
                $params['[number]'][] = ++$key;
                $params['[full_name]'][] = $tourGuide->full_name;
                $params['[tourist_destination]'][] = $event->touristDestination->name;
                $params['[time]'][] = Carbon::parse($event->time)->format('d-m-Y H:i:s');
                $params['[camera]'][] = $event->camera->name;
            }
        }

        return  resolve(ExcelExporterServices::class)->export('object_image', $params);
    }

    public function syncTourGuide()
    {
        $limit = 500;

        $pages = SyncTourGuideService::getPage($limit);

        for ($page = 1; $page <= $pages; $page++) {
            dispatch(new ImportTourGuideJob($page, $limit, 'NEW', null));
        }

        return [];
    }

    public function syncTourGuideAndImage()
    {
        $this->syncTourGuide();
        $this->syncTourGuideImage();

        return [];
    }

    public function syncTourGuideImage()
    {
        ini_set('max_execution_time', '30000');
        $max = 100;
        $total = TourGuide::count();

        $pages = ceil($total / $max);

        for ($i = 1; $i < ($pages + 1); $i++) {
            $offset = (($i - 1)  * $max);
            $start = ($offset == 0 ? 0 : ($offset + 1));

            $legacy = TourGuide::whereNotNull('sync_data_id')->skip($start)->take($max)->get();

            dispatch(new ImportTourGuideJob(null, null, 'ADD_IMAGE', $legacy));
        }

        return [];
    }

    public function countObjects($attributes)
    {
        if (!empty($attributes['updated_at'])) {
            $this->model = $this->model->where('updated_at', '>=', $attributes['updated_at']);
        }

        if (!empty($attributes['is_image'])) {
            $this->model = $this->model->has('media');
        }

        $tourGuide = $this->count();

        return [
            'data' => [
                'count_object' => $tourGuide
            ]
        ];
    }
}
