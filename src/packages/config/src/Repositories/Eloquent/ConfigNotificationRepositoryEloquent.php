<?php

namespace GGPHP\Config\Repositories\Eloquent;

use GGPHP\Config\Models\ConfigNotification;
use GGPHP\Config\Presenters\ConfigNotificationPresenter;
use GGPHP\Config\Repositories\Contracts\ConfigNotificationRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ConfigRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ConfigNotificationRepositoryEloquent extends CoreRepositoryEloquent implements ConfigNotificationRepository
{

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ConfigNotification::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return ConfigNotificationPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function getConfigNotification($attributes)
    {
        if (!empty($attributes['limit'])) {
            $results = $this->paginate($attributes['limit']);
        } else {
            $results = $this->get();
        }

        return $results;
    }

    public function createConfigNotification($attributes)
    {
        $attributes = $this->creating($attributes);

        $workHour = ConfigNotification::where('Type', $attributes['workHour']['type'])->first();

        if (is_null($workHour)) {
            ConfigNotification::create($attributes['workHour']);
        } else {
            $workHour->update($attributes['workHour']);
        }

        $businessCard = ConfigNotification::where('Type', $attributes['businessCard']['type'])->first();

        if (is_null($businessCard)) {
            ConfigNotification::create($attributes['businessCard']);
        } else {
            $businessCard->update($attributes['businessCard']);
        }

        $birthday = ConfigNotification::where('Type', $attributes['birthday']['type'])->first();

        if (is_null($birthday)) {
            ConfigNotification::create($attributes['birthday']);
        } else {
            $birthday->update($attributes['birthday']);
        }

        return parent::all();
    }

    public function creating($attributes)
    {
        $attributes['workHour']['type'] = ConfigNotification::TYPE[$attributes['workHour']['type']];
        $attributes['businessCard']['type'] = ConfigNotification::TYPE[$attributes['businessCard']['type']];
        $attributes['birthday']['type'] = ConfigNotification::TYPE[$attributes['birthday']['type']];

        return $attributes;
    }
}
