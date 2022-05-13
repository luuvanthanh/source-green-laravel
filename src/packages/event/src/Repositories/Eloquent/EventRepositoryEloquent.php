<?php

namespace GGPHP\Event\Repositories\Eloquent;

use alhimik1986\PhpExcelTemplator\params\CallbackParam;
use alhimik1986\PhpExcelTemplator\PhpExcelTemplator;
use Carbon\Carbon;
use GGPHP\Camera\Models\Camera;
use GGPHP\Category\Models\EventType;
use GGPHP\Event\Events\EventCreateEvent;
use GGPHP\Event\Jobs\SendEmailEventCreate;
use GGPHP\Event\Models\Event;
use GGPHP\Event\Models\EventHandle;
use GGPHP\Event\Presenters\EventPresenter;
use GGPHP\Event\Repositories\Contracts\EventRepository;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\Notification\Services\NotificationService;
use GGPHP\SystemConfig\Models\SystemConfig;
use GGPHP\SystemConfig\Models\TeamplateEmail;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;
use Webpatser\Uuid\Uuid;

/**
 * Class EventRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class EventRepositoryEloquent extends BaseRepository implements EventRepository
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
        return Event::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return EventPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function getEvent(array $attributes, $parse = true)
    {
        if (!empty($attributes['event_type_id'])) {
            $evenTypeId = explode(',', $attributes['event_type_id']);
            $this->model = $this->model->whereIn('event_type_id', $evenTypeId);
        }

        if (!empty($attributes['tourist_destination_id'])) {
            $touristDestinationId = explode(',', $attributes['tourist_destination_id']);
            $this->model = $this->model->whereIn('tourist_destination_id', $touristDestinationId);
        }

        if (!empty($attributes['camera_id'])) {
            $cameraId = explode(',', $attributes['camera_id']);
            $this->model = $this->model->whereIn('camera_id', $cameraId);
        }

        if (!empty($attributes['warning_level'])) {
            $this->model = $this->model->whereIn('warning_level', $attributes['warning_level']);
        }

        if (!empty($attributes['tour_guide_id'])) {
            $tourGuideId = explode(',', $attributes['tour_guide_id']);
            $this->model = $this->model->whereIn('tour_guide_id', $tourGuideId);
        }

        if (!empty($attributes['status_detail'])) {
            $this->model = $this->model->whereIn('status_detail', $attributes['status_detail']);
        }

        if (!empty($attributes['status'])) {
            $this->model = $this->model->whereIn('status', $attributes['status']);
        }

        if (!empty($attributes['start_time']) && !empty($attributes['end_time'])) {
            $this->model = $this->model->where('time', '>=', $attributes['start_time'])->where('time', '<=', $attributes['end_time']);
        }
        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->whereDate('time', '>=', $attributes['start_date'])->whereDate('time', '<=', $attributes['end_date']);
        }

        if (!empty($attributes['event_code'])) {
            $this->model = $this->model->whereHas('eventType', function ($query) use ($attributes) {
                $query->where('code', $attributes['event_code']);
            });
        }

        if (!empty($attributes['is_follow'])) {
            $attributes['is_follow'] = $attributes['is_follow'] == 'true' ? true : false;
            $this->model = $this->model->where('is_follow', $attributes['is_follow']);
        }

        if (!empty($attributes['date'])) {
            $this->model = $this->model->whereDate('time', $attributes['date']);
        }

        if (!empty($attributes['event_handle_muti_id'])) {
            $this->model = $this->model->where('event_handle_muti_id', $attributes['event_handle_muti_id']);
        }

        if (!$parse) {
            return $this->model->get();
        }

        if (empty($attributes['limit'])) {
            $event = $this->all();
        } else {
            $event = $this->paginate($attributes['limit']);
        }

        return $event;
    }

    public function createAi(array $attributes)
    {
        if ($attributes['event_code'] == 'UPDATE_VIDEO') {
            $event = $this->model()::where('track_id', $attributes['track_id'])->first();
            if (!is_null($event) && !empty($attributes['video_path'])) {
                $event->addMediaFromDisk($attributes['video_path'])->preservingOriginal()->toMediaCollection('video');

                return parent::find($event->id);
            }

            return [];
        }

        $camera = Camera::find($attributes['camera_id']);
        $attributes['tourist_destination_id'] = $camera->tourist_destination_id;

        if (!empty($attributes['object_id'])) {
            $attributes['tour_guide_id'] = $attributes['object_id'];
        }

        $eventType = EventType::where('code', $attributes['event_code'])->first();
        $attributes['event_type_id'] = $eventType->id;

        $event = null;

        if (!empty($attributes['track_id'])) {
            $event = $this->model()::where('track_id', $attributes['track_id'])->first();
        }

        if (is_null($event)) {
            $event = $this->model()::create($attributes);

            broadcast(new EventCreateEvent([
                'event_id' => $event->id,
                'type' => 'EVENT_CREATE'
            ]));

            NotificationService::eventCreated(NotificationService::EVENT, $event);

            $teamplateEmail = TeamplateEmail::where('code', $event->eventType->code)->first();

            if (!is_null($teamplateEmail) && $teamplateEmail->is_on) {
                $systemConfig = SystemConfig::first();

                $receiveEmail = $systemConfig->receiveEmail;

                foreach ($receiveEmail as  $user) {
                    dispatch(new SendEmailEventCreate($event, $user, $teamplateEmail));
                }
            }

            if (!empty($attributes['image_path'])) {
                $event->addMediaFromDisk($attributes['image_path'])->preservingOriginal()->toMediaCollection('image');
            }

            if (!empty($attributes['video_path'])) {
                $event->addMediaFromDisk($attributes['video_path'])->preservingOriginal()->toMediaCollection('video');
            }
        } else {

            $event->update($attributes);
            broadcast(new EventCreateEvent([
                'event_id' => $event->id,
                'type' => 'EVENT_CREATE'
            ]));
            if (!empty($attributes['image_path'])) {
                $event->addMediaFromDisk($attributes['image_path'])->preservingOriginal()->toMediaCollection('image');
            }

            if (!empty($attributes['video_path'])) {
                $event->addMediaFromDisk($attributes['video_path'])->preservingOriginal()->toMediaCollection('video');
            }
        }


        // if (!empty($attributes['related_images'])) {
        //     $event->clearMediaCollection('related_images');
        //     $event->addMediaToEntity($event, $attributes['related_images'], 'related_images');
        // }

        return parent::find($event->id);
    }

    public function skipEvent(array $attributes, $id)
    {
        $event = $this->model()::findOrFail($id);

        $event->update([
            'status' => $this->model()::STATUS['DONE'],
            'status_detail' => $this->model()::STATUS_DETAIL['SKIP']
        ]);

        $attributes['event_id'] = $id;
        EventHandle::create($attributes);

        return parent::find($id);
    }

    public function handleEvent(array $attributes, $id)
    {
        $event = $this->model()::findOrFail($id);

        $attributes['is_follow'] = false;
        if ($attributes['status_detail'] == $this->model()::STATUS_DETAIL['HANDLE_FOLLOW']) {
            $attributes['is_follow'] = true;
        }

        $event->update([
            'status' => $attributes['status'],
            'status_detail' => $attributes['status_detail'],
            'is_follow' => $attributes['is_follow']
        ]);

        $attributes['event_id'] = $id;
        EventHandle::create($attributes);

        return parent::find($id);
    }

    public function handleEventMuti(array $attributes, $id)
    {
        $event = $this->model()::findOrFail($id);

        \DB::beginTransaction();
        try {
            $attributes['is_follow'] = false;
            if ($attributes['status_detail'] == $this->model()::STATUS_DETAIL['HANDLE_FOLLOW']) {
                $attributes['is_follow'] = true;
            }

            $idHandle = Uuid::generate(4)->string;

            $event->update([
                'status' => $attributes['status'],
                'status_detail' => $attributes['status_detail'],
                'is_follow' => $attributes['is_follow'],
                'event_handle_muti_id' => $idHandle
            ]);

            $attributes['event_id'] = $id;
            EventHandle::create($attributes);

            foreach ($attributes['related_events'] as $relatedEventId) {
                $relatedEvent = $this->model()::findOrFail($relatedEventId);

                $relatedEvent->update([
                    'status' => $attributes['status'],
                    'status_detail' => $attributes['status_detail'],
                    'is_follow' => $attributes['is_follow'],
                    'event_handle_muti_id' => $idHandle
                ]);

                $attributes['event_id'] = $relatedEventId;
                EventHandle::create($attributes);
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \Log::error($th);
            \DB::rollback();
        }



        return parent::find($id);
    }

    public function updateHandleEvent(array $attributes, $id)
    {
        $eventHandle = EventHandle::findOrFail($attributes['event_handle_id']);

        $eventHandle->update([
            'user_edit' => $attributes['user_edit'],
            'note' => $attributes['note']
        ]);

        return parent::find($id);
    }

    public function exportExcel($attributes)
    {
        $events = $this->getEvent($attributes, false);

        $params = [];
        foreach ($events as $key => $event) {
            $params['[number]'][] = ++$key;
            $params['[event_type]'][] = !is_null($event->eventType) ?  $event->eventType->name : null;
            $params['[time]'][] = !is_null($event->time) ?  Carbon::parse($event->time)->format('d-m-Y, H:m') : null;
            $params['[tourist_destination]'][] = !is_null($event->touristDestination) ?  $event->touristDestination->name : null;
            $params['[camera]'][] = !is_null($event->camera) ? $event->camera->name : null;
            $params['[warning_level]'][] = $this->getConstWarningLevel($event->warning_level);
            $params['[status]'][] =  $this->getConstStatus($event->status);
            $params['[percent_similarity]'][] = !empty($event->percent_similarity) ? round($event->percent_similarity * 100, 2) . '%' : '';

            $imageMedia = $event->getMedia('image');
            $imageMedia = $imageMedia->isEmpty() ? null : $imageMedia->first();
            $image = null;
            if (!is_null($imageMedia)) {
                $image = $imageMedia->getPath();
            }
            $params['[image]'][] =  $image;
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

        $events = [];

        return  resolve(ExcelExporterServices::class)->export('event', $params, $callbacks, $event);
    }


    public function exportWord($id)
    {
        $event = Event::findOrFail($id);

        $tourGuide = !is_null($event->tourGuide) ?  $event->tourGuide : null;
        $classify = null;

        if (!is_null($tourGuide)) {
            $classify = !is_null($tourGuide->objectType) ?  $tourGuide->objectType->name : null;
        }

        $params = [
            'date_now' => Carbon::now()->format('d'),
            'month_now' =>  Carbon::now()->format('m'),
            'year_now' =>  Carbon::now()->format('Y'),
            'event_type' => !is_null($event->eventType) ?  $event->eventType->name : null,
            'time' =>  !is_null($event->time) ?  Carbon::parse($event->time)->format('d-m-Y, H:m') : null,
            'tourist_destination' => !is_null($event->touristDestination) ?  $event->touristDestination->name : null,
            'camera' => !is_null($event->camera) ? $event->camera->name : null,
            'warning_level' => $this->getConstWarningLevel($event->warning_level),
            'status' =>  $this->getConstStatus($event->status),
            'tour_guide' => !is_null($tourGuide) ?  $tourGuide->full_name : null,
            'classify' => $classify,
        ];

        return resolve(WordExporterServices::class)->exportWord('event', $params);
    }

    public function getConstWarningLevel($value)
    {
        $result = null;
        switch ($value) {
            case Event::WARNING_LEVEL['LOW']:
                $result = 'Thấp';
                break;
            case Event::WARNING_LEVEL['MEDIUM']:
                $result = 'Trung bình';
                break;
            case Event::WARNING_LEVEL['HIGH']:
                $result = 'Cao';
                break;
            case Event::WARNING_LEVEL['EMERGENCY']:
                $result = 'Khẩn cấp';
                break;
        }

        return $result;
    }

    public function getConstStatus($value)
    {
        $result = null;
        switch ($value) {
            case Event::STATUS['PENDING']:
                $result = 'Chưa xử lý';
                break;
            case Event::STATUS['DOING']:
                $result = 'Đang xử lý';
                break;
            case Event::STATUS['DONE']:
                $result = 'Đã xử lý';
                break;
        }

        return $result;
    }
}
