<?php

namespace GGPHP\Crm\CustomerPotential\Repositories\Eloquent;

use GGPHP\Crm\CustomerPotential\Models\PotentialStudentInfo;
use GGPHP\Crm\CustomerPotential\Presenters\PotentialStudentInfoPresenter;
use GGPHP\Crm\CustomerPotential\Repositories\Contracts\PotentialStudentInfoRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class PotentialStudentInfoRepositoryEloquent extends BaseRepository implements PotentialStudentInfoRepository
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
        return PotentialStudentInfo::class;
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
        return PotentialStudentInfoPresenter::class;
    }

    public function getPotentailStudentInfo(array $attributes)
    {
        if (!empty($attributes['customer_potential_id'])) {
            $this->model = $this->model->where('customer_potential_id', $attributes['customer_potential_id']);
        }

        if (!empty($attributes['limit'])) {
            $PotentialStudentInfo = $this->paginate($attributes['limit']);
        } else {
            $PotentialStudentInfo = $this->get();
        }

        return $PotentialStudentInfo;
    }

    public function create(array $attributes)
    {
        if (!empty($attributes['createRows'])) {
            foreach ($attributes['createRows'] as $value) {
                $value['relationship'] = PotentialStudentInfo::RELATIONSHIP[$value['relationship']];
                $value['sex'] = PotentialStudentInfo::SEX[$value['sex']];
                PotentialStudentInfo::create($value);
            }
        }

        if (!empty($attributes['updateRows'])) {
            foreach ($attributes['updateRows'] as $value) {
                $updateStudentInfo = PotentialStudentInfo::find($value['id']);
                $value['relationship'] = PotentialStudentInfo::RELATIONSHIP[$value['relationship']];
                $value['sex'] = PotentialStudentInfo::SEX[$value['sex']];
                $updateStudentInfo->update($value);
            }
        }

        if (!empty($attributes['deleteRows'])) {
            PotentialStudentInfo::whereIn('id', $attributes['deleteRows'])->delete();
        }

        return parent::all();
    }
}
