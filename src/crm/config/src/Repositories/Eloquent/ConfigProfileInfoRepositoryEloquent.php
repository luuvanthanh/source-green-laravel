<?php

namespace GGPHP\Crm\Config\Repositories\Eloquent;

use GGPHP\Crm\Config\Models\ConfigMedicalDeclare;
use GGPHP\Crm\Config\Models\ConfigMedicalDeclareDetail;
use GGPHP\Crm\Config\Models\ConfigProfileInfo;
use GGPHP\Crm\Config\Presenters\ConfigProfileInfoPresenter;
use GGPHP\Crm\Config\Repositories\Contracts\ConfigProfileInfoRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ConfigProfileInfoRepositoryEloquent extends BaseRepository implements ConfigProfileInfoRepository
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
        return ConfigProfileInfo::class;
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
        return ConfigProfileInfoPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $configProfileInfo = $this->paginate($attributes['limit']);
        } else {
            $configProfileInfo = $this->get();
        }

        return $configProfileInfo;
    }

    public function createOrUpdate(array $attributes)
    {
        if (!empty($attributes['create_rows'])) {
            foreach ($attributes['create_rows'] as $value) {
                $configProfileInfo = ConfigProfileInfo::create($value);
            }
        }

        if (!empty($attributes['update_rows'])) {
            foreach ($attributes['update_rows'] as $value) {
                $configProfileInfo = ConfigProfileInfo::find($value['id']);
                $configProfileInfo->update($value);
            }
        }

        if (!empty($attributes['delete_rows'])) {
            ConfigProfileInfo::whereIn('id', $attributes['delete_rows'])->delete();
        }

        return parent::all();
    }
}
