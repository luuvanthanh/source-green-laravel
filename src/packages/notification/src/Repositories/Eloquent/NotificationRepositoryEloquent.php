<?php

namespace GGPHP\Notification\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Notification\Models\Notification;
use GGPHP\Notification\Presenters\NotificationPresenter;
use GGPHP\Notification\Repositories\Contracts\NotificationRepository;
// use GGPHP\Notification\Services\NotificationService;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class NotificationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class NotificationRepositoryEloquent extends BaseRepository implements NotificationRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'id',
        'user_id',
        'project_id',
        'work_id',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Notification::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return NotificationPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function getNoti($attributes)
    {
        if (!empty($attributes['user_id'])) {
            $this->model = $this->model->where('notifiable_id', $attributes['user_id']);
        }

        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->where('created_at', '>=', $attributes['start_date'])->where('created_at', '<=', $attributes['end_date']);
        }

        if (!empty($attributes['event_type'])) {
            $this->model = $this->model->whereJsonContains('data->event_type', $attributes['event_type']);
        }

        if (!empty($attributes['tourist_destination_id'])) {
            $this->model = $this->model->where('tourist_destination_id', $attributes['tourist_destination_id']);
        }

        if (!empty($attributes['limit'])) {
            $notifications = $this->paginate($attributes['limit']);
        } else {
            $notifications = $this->get();
        }

        return $notifications;
    }

    /**
     * Get Notifications.
     *
     * @param  array $attributes attributes from request
     * @return object
     * @throws \Exception
     */
    public function markAsRead($id)
    {
        $notification = $this->model()::findOrFail($id);

        $notification->markAsRead();

        return parent::parserResult($notification);
    }

    /**
     * Get Notifications.
     *
     * @param  array $attributes attributes from request
     * @return object
     * @throws \Exception
     */
    public function readAll($id)
    {
        $notification = $this->model()::where('notifiable_id', $id)->whereNull('read_at')->update([
            'read_at' => Carbon::now()
        ]);

        return [];
    }
}
