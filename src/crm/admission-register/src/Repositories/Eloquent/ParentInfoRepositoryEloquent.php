<?php

namespace GGPHP\Crm\AdmissionRegister\Repositories\Eloquent;

use GGPHP\Crm\AdmissionRegister\Models\ParentInfo;
use GGPHP\Crm\AdmissionRegister\Presenters\ParentInfoPresenter;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\ParentInfoRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ParentInfoRepositoryEloquent extends BaseRepository implements ParentInfoRepository
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
        return ParentInfo::class;
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
        return ParentInfoPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['admission_register_id'])) {
            $this->model = $this->model->where('admission_register_id', $attributes['admission_register_id']);
        }

        if (!empty($attributes['limit'])) {
            $parentInfo = $this->paginate($attributes['limit']);
        } else {
            $parentInfo = $this->get();
        }

        return $parentInfo;
    }

    public function createOrUpdate(array $attributes)
    {
        $parentInfo = ParentInfo::where('admission_register_id', $attributes['admission_register_id'])->first();

        if (is_null($parentInfo)) {
            ParentInfo::create($attributes);
        }

        if (!is_null($parentInfo)) {
            $parentInfo->update($attributes);
        }

        return $this->parserResult($parentInfo);
    }
}
