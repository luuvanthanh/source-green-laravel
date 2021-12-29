<?php

namespace GGPHP\Notification\Repositories\Eloquent;

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

    public function readAll($id)
    {
        Notification::where('user_id', $id)->update(['is_read' => true]);

        return true;
    }
}
