<?php

namespace GGPHP\Crm\AdmissionRegister\Repositories\Eloquent;

use GGPHP\Crm\AdmissionRegister\Models\ProfileInfo;
use GGPHP\Crm\AdmissionRegister\Presenters\ProfileInfoPresenter;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\ProfileInfoRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ProfileInfoRepositoryEloquent extends BaseRepository implements ProfileInfoRepository
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
        return ProfileInfo::class;
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
        return ProfileInfoPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['admission_register_id'])) {
            $this->model = $this->model->where('admission_register_id', $attributes['admission_register_id']);
        }

        if (!empty($attributes['limit'])) {
            $ProfileInfo = $this->paginate($attributes['limit']);
        } else {
            $ProfileInfo = $this->get();
        }

        return $ProfileInfo;
    }

    public function createOrUpdate(array $attributes)
    {
        if (!empty($attributes['create_rows'])) {
            foreach ($attributes['create_rows'] as $value) {
                $profileInfo = ProfileInfo::create($value);
            }
        }

        if (!empty($attributes['update_rows'])) {
            foreach ($attributes['update_rows'] as $value) {
                $profileInfo = ProfileInfo::findOrFail($value['id']);
                $profileInfo->update($value);
            }
        }

        if (!empty($attributes['delete_rows'])) {
            ProfileInfo::whereIn('id', $attributes['delete_rows'])->delete();
        }

        return parent::all();
    }
}
