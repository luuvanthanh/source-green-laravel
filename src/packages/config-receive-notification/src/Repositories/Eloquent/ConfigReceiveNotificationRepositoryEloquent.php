<?php

namespace GGPHP\ConfigReceiveNotification\Repositories\Eloquent;

use GGPHP\Category\Models\EventType;
use GGPHP\ConfigReceiveNotification\Models\ConfigReceiveNotification;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\ConfigReceiveNotification\Presenters\ConfigReceiveNotificationPresenter;
use GGPHP\ConfigReceiveNotification\Repositories\Contracts\ConfigReceiveNotificationRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class ConfigReceiveNotificationRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class ConfigReceiveNotificationRepositoryEloquent extends BaseRepository implements ConfigReceiveNotificationRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ConfigReceiveNotification::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function presenter()
    {
        return ConfigReceiveNotificationPresenter::class;
    }

    public function getConfigReceiveNotification(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $configReceiveNotification = $this->paginate($attributes['limit']);
        } else {
            $configReceiveNotification = $this->get();
        }

        return $configReceiveNotification;
    }

    public function configReceiveNotificationByUser($attributes)
    {
        $configReceiveNotifications = new Collection();

        if (!empty($attributes['user_id'])) {
            $configReceiveNotifications = ConfigReceiveNotification::where('user_id', $attributes['user_id'])->get();

            $eventType = EventType::get();
            if ($eventType->isNotEmpty()) {
                if ($configReceiveNotifications->isEmpty()) {
                    foreach ($eventType as $key => $value) {
                        $data = [
                            'user_id' => $attributes['user_id'],
                            'event_type_id' => $value->id
                        ];
                        ConfigReceiveNotification::create($data);
                    }
                } else {
                    foreach ($eventType as $key => $value) {
                        $configReceiveNotification = ConfigReceiveNotification::where('user_id', $attributes['user_id'])->where('event_type_id', $value->id)->first();

                        if (is_null($configReceiveNotification)) {
                            $data = [
                                'user_id' => $attributes['user_id'],
                                'event_type_id' => $value->id
                            ];
                            ConfigReceiveNotification::create($data);
                        }
                    }
                }
                $configReceiveNotifications = ConfigReceiveNotification::where('user_id', $attributes['user_id'])->get();
            }
        }

        return $this->parserResult($configReceiveNotifications);
    }

    public function turnOnOffConfigReceiveNotification($attributes)
    {
        foreach ($attributes['data'] as $value) {
            $configReceiveNotification = ConfigReceiveNotification::where('user_id', $attributes['user_id'])->where('event_type_id', $value['event_type_id'])->first();
            $configReceiveNotification->update(['is_use' => $value['is_use']]);
        }

        $configReceiveNotifications = ConfigReceiveNotification::where('user_id', $attributes['user_id'])->get();

        return $this->parserResult($configReceiveNotifications);
    }
}
