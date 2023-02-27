<?php

namespace GGPHP\DecisionNumberSample\Repositories\Eloquent;

use GGPHP\DecisionNumberSample\Models\DecisionNumberSample;
use GGPHP\DecisionNumberSample\Presenters\DecisionNumberSamplePresenter;
use GGPHP\DecisionNumberSample\Repositories\Contracts\DecisionNumberSampleRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Core\Services\CrmService;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class DecisionNumberSampleRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class DecisionNumberSampleRepositoryEloquent extends CoreRepositoryEloquent implements DecisionNumberSampleRepository
{
    protected $fieldSearchable = [
        'Id',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return DecisionNumberSample::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return DecisionNumberSamplePresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function getDecisionNumberSample(array $attributes)
    {
        $this->model = $this->model->when(!empty($attributes['type']), function ($query) use ($attributes) {
            return $query->where('Type', $attributes['type']);
        });

        $this->model = $this->model->when(!empty($attributes['decisionDate']), function ($query) use ($attributes) {
            return $query->whereDate('StartDate', '<=', $attributes['decisionDate'])->whereDate('EndDate', '>=', $attributes['decisionDate']);
        });

        if (!empty($attributes['limit'])) {
            $result = $this->paginate($attributes['limit']);
        } else {
            $result = $this->get();
        }

        return $result;
    }

    public function updateOrdinalNumberOfCreated($model, $attributes)
    {
        $decisionNumberSample = DecisionNumberSample::findOrFail($attributes['decisionNumberSampleId']);

        $decisionNumberSample->update(['OrdinalNumber' => $model->OrdinalNumber]);
    }

    public function updateOrdinalNumberOfUpdated($model, $attributes)
    {
        $typeDecision = DecisionNumberSample::TYPE[$attributes['type']];
        
        $decisionNumberSample = DecisionNumberSample::whereDate('StartDate', '<=', $model->DecisionDate)
            ->whereDate('EndDate', '>=', $model->DecisionDate)
            ->where('Type', $typeDecision)->first();
        if (!$decisionNumberSample) {
            return null;
        }

        if (!is_null($model->OrdinalNumber)) {
            $decisionNumberSample->update(['OrdinalNumber' => $model->OrdinalNumber]);
        }
    }
}
