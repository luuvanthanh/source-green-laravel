<?php

namespace GGPHP\LateEarly\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\LateEarly\Models\LateEarlyTimeConfig;
use GGPHP\LateEarly\Presenters\LateEarlyConfigPresenter;
use GGPHP\LateEarly\Repositories\LateEarly\LateEarlyConfigRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class LateEarlyConfigRepositoryEloquent extends CoreRepositoryEloquent implements LateEarlyConfigRepository
{
    protected $fieldSearchable = [
        'Type',
        'CreationTime',
    ];
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
        if (!empty($attributes['createRows'])) {
            foreach ($attributes['createRows'] as $value) {
                $lateEarlyConfig = $this->model()::create($value);
            }
        }

        if (!empty($attributes['updateRows'])) {
            foreach ($attributes['updateRows'] as $value) {
                $lateEarlyConfig = $this->model()::find($value['Id']);
                if ($lateEarlyConfig) {
                    $lateEarlyConfig->update($value);
                }
            }
        }

        if (!empty($attributes['deleteIds'])) {
            LateEarlyTimeConfig::whereIn('Id', $attributes['deleteIds'])->delete();
        }

        $this->model = $this->model()::where('Type', $attributes['type']);
        return $this->get();
    }
}
