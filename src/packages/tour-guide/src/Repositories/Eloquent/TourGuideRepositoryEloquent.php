<?php

namespace GGPHP\TourGuide\Repositories\Eloquent;

use alhimik1986\PhpExcelTemplator\params\CallbackParam;
use Carbon\Carbon;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\TourGuide\Jobs\ImportTourGuideJob;
use GGPHP\TourGuide\Models\TourGuide;
use GGPHP\TourGuide\Models\TourGuideAdditionalInformation;
use GGPHP\TourGuide\Presenters\TourGuidePresenter;
use GGPHP\TourGuide\Repositories\Contracts\TourGuideRepository;
use GGPHP\TourGuide\Services\SyncTourGuideService;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
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

        if (request()->route()->getName() == 'tour-guides-share' || request()->route()->getName() == 'tour-guides-identification-share') {
            $this->model = $this->model->select(
                'full_name',
                'sex',
                'id_card',
                'date_of_birth',
                'degree',
                'professional_certificate',
                'nationality',
                'home_town',
                'resident',
            );
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
            $params['[nationality]'][] = $tourGuide->nationality;
            $params['[home_town]'][] = $tourGuide->home_town;
            $params['[card_type]'][] = !is_null($tourGuide->cardType) ? $tourGuide->cardType->name : null;
            $params['[card_number]'][] = $tourGuide->card_number;
            $params['[object_type]'][] = $tourGuide->objectType ? $tourGuide->objectType->name : null;
            $params['[language]'][] = !is_null($tourGuide->language) ?  $tourGuide->language->vietnamese_name : null;
            $params['[expiration_date]'][] = !is_null($tourGuide->expiration_date) ?  Carbon::parse($tourGuide->expiration_date)->format('d-m-Y') : null;
        }

        if ($attributes['type'][0] == TourGuide::TYPE['ILLEGAL']) {
            return  resolve(ExcelExporterServices::class)->export('hdvbhp', $params);
        }
        if ($attributes['type'][0] == TourGuide::TYPE['OBJECT_TRACKED']) {
            return  resolve(ExcelExporterServices::class)->export('dtctd', $params);
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
            $imageUrl = explode(',', $attributes['image_url']);
            $data = [
                'face_urls_as_bytes' => json_encode([
                    'face_urls' => $imageUrl
                ])
            ];

            $response = Http::asForm()->post(env('AI_SERVICE_URL') . '/ai_core/search_face', $data);

            $attributes['object_id'] = null;
            if ($response->successful()) {
                if (!empty(json_decode($response->body())->person_id)) {
                    $attributes['object_id'] = json_decode($response->body())->person_id;
                }
            }

            if (is_null($attributes['object_id']) || empty($attributes['object_id'])) {
                return  [
                    'data' => []
                ];
            } else {
                $this->model = $this->model->where('id', $attributes['object_id']);
            }
        }

        if (!empty($attributes['type'])) {
            $this->model = $this->model->whereIn('type', $attributes['type']);
        }

        if (!empty($attributes['keyword'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('full_name', $attributes['keyword']);
            });
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
        $fileRemove = [];
        foreach ($tourGuides as $key => $tourGuide) {
            foreach ($tourGuide->event as $keyEvent => $event) {
                $params['[number]'][] = ++$key;
                $params['[full_name]'][] = $tourGuide->full_name;
                $params['[tourist_destination]'][] = $event->touristDestination->name;
                $params['[time]'][] = Carbon::parse($event->time)->format('d-m-Y H:i:s');
                $params['[camera]'][] = $event->camera ? $event->camera->name : null;
                $imageMedia = $event->getMedia('image');
                $imageMedia = $imageMedia->isEmpty() ? null : $imageMedia->first();
                $image = null;
                if (!is_null($imageMedia)) {
                    $image = $imageMedia->getPath();
                    $name = explode('/', $image);
                    $fileRemove[] =  $name[1];
                }
                $params['[image]'][] = $image;
            }
        }

        $callbacks = [
            '[image]' => function (CallbackParam $param) {
                $row_index = $param->row_index;
                $cell_coordinate = $param->coordinate;
                $sheet = $param->sheet;
                $value = $param->param[$row_index];

                if (\Storage::disk('minio')->exists($value)) {
                    $fileMinio = \Storage::disk('minio')->get($value);
                    $name = explode('/', $value);
                    Storage::disk('local')->put($name[1], $fileMinio);

                    if (Storage::disk('local')->exists($name[1])) {
                        $drawing = new Drawing();
                        $drawing->setPath(Storage::disk('local')->path($name[1]));
                        $drawing->setCoordinates($cell_coordinate);
                        $drawing->setWorksheet($sheet);
                        $drawing->setHeight(100);
                        $sheet->getCell($cell_coordinate)->setValue(null);
                    }
                }
            },
        ];
        $eventCallback = [];
        return  resolve(ExcelExporterServices::class)->export('object_image', $params, $callbacks, $eventCallback, $fileRemove);
    }

    public function syncTourGuide()
    {
        $token = token_csdl();

        $limit = 500;

        $pages = SyncTourGuideService::getPage($limit, $token);

        for ($page = 1; $page <= $pages; $page++) {
            dispatch(new ImportTourGuideJob($page, $limit, 'NEW', null, $token));
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
        $token = token_csdl();

        $pages = ceil($total / $max);

        for ($i = 1; $i < ($pages + 1); $i++) {
            $offset = (($i - 1)  * $max);
            $start = ($offset == 0 ? 0 : ($offset + 1));

            $legacy = TourGuide::whereNotNull('sync_data_id')->skip($start)->take($max)->get();

            dispatch(new ImportTourGuideJob(null, null, 'ADD_IMAGE', $legacy, $token));
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
