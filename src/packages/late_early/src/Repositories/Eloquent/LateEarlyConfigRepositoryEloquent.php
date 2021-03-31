<?php

namespace GGPHP\LateEarly\Repositories\Eloquent;

use GGPHP\LateEarly\Models\LateEarlyTimeConfig;
use GGPHP\LateEarly\Presenters\LateEarlyConfigPresenter;
use GGPHP\LateEarly\Repositories\LateEarly\LateEarlyConfigRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class LateEarlyConfigRepositoryEloquent extends BaseRepository implements LateEarlyConfigRepository
{
    protected $fieldSearchable = ['type'];
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return LateEarlyTimeConfig::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return LateEarlyConfigPresenter::class;
    }

    /**
     * createOrUpdateLateEarlyConfig
     * @param $attributes
     * @return $this
     */
    public function createOrUpdateLateEarlyConfig($attributes)
    {
        if (!empty($attributes['create_rows'])) {
            $lateEarlyConfig = $this->model()::insert($attributes['create_rows']);
        }

        if (!empty($attributes['update_rows'])) {
            foreach ($attributes['update_rows'] as $value){
                $lateEarlyConfig = $this->model()::find($value['id']);
                if ($lateEarlyConfig) {
                    $lateEarlyConfig->update($value);
                }
            }
        }

        if (!empty($attributes['delete_ids'])) {
            LateEarlyTimeConfig::whereIn('id', $attributes['delete_ids'])->delete();
        }

        $this->model = $this->model()::where('type', $attributes['type']);
        return $this->get();
    }
}
