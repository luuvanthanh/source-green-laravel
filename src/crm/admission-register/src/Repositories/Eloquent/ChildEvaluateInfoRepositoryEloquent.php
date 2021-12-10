<?php

namespace GGPHP\Crm\AdmissionRegister\Repositories\Eloquent;

use GGPHP\Crm\AdmissionRegister\Models\ChildDescription;
use GGPHP\Crm\AdmissionRegister\Models\ChildEvaluateInfo;
use GGPHP\Crm\AdmissionRegister\Models\ChildIssue;
use GGPHP\Crm\AdmissionRegister\Presenters\ChildEvaluateInfoPresenter;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\ChildEvaluateInfoRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ChildEvaluateInfoRepositoryEloquent extends BaseRepository implements ChildEvaluateInfoRepository
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
        return ChildEvaluateInfo::class;
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
        return ChildEvaluateInfoPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['admission_register_id'])) {
            $this->model = $this->model->where('admission_register_id', $attributes['admission_register_id']);
        }

        if (!empty($attributes['limit'])) {
            $childEvaluateInfo = $this->paginate($attributes['limit']);
        } else {
            $childEvaluateInfo = $this->get();
        }

        return $childEvaluateInfo;
    }

    public function create(array $attributes)
    {
        $childEvaluateInfo = ChildEvaluateInfo::where('admission_register_id', $attributes['admission_register_id'])->first();
      
        if (is_null($childEvaluateInfo)) {
            $childEvaluateInfo = ChildEvaluateInfo::create($attributes);
        } else {
            $childEvaluateInfo->update($attributes);
        }
        
        ChildDescription::where('child_evaluate_info_id', $childEvaluateInfo->id)->delete();
        ChildIssue::where('child_evaluate_info_id', $childEvaluateInfo->id)->delete();

        if (!empty($attributes['child_description'])) {
            foreach ($attributes['child_description'] as $value) {
                $value['child_evaluate_info_id'] = $childEvaluateInfo->id;
                ChildDescription::create($value);
            }
        }

        if (!empty($attributes['child_issue'])) {
            foreach ($attributes['child_issue'] as $value) {
                $value['child_evaluate_info_id'] = $childEvaluateInfo->id;
                ChildIssue::create($value);
            }
        }

        return parent::all();
    }
}
