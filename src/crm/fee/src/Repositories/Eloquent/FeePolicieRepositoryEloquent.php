<?php

namespace GGPHP\Crm\Fee\Repositories\Eloquent;

use GGPHP\Crm\Fee\Models\FeePolicie;
use GGPHP\Crm\Fee\Models\SchoolYear;
use GGPHP\Crm\Fee\Presenters\FeePoliciePresenter;
use GGPHP\Crm\Fee\Repositories\Contracts\FeePolicieRepository;
use GGPHP\Crm\Fee\Services\FeePolicieCloverService;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class SsoAccountRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class FeePolicieRepositoryEloquent extends BaseRepository implements FeePolicieRepository
{

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return FeePolicie::class;
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
        return FeePoliciePresenter::class;
    }

    public function getFeePolicie(array $attributes)
    {
        if (!empty($attributes['from']) && !empty($attributes['to'])) {
            $this->model = $this->model->whereYear('decision_date', '>=', $attributes['from'])
                ->whereYear('decision_date', '<=', $attributes['to']);
        }
        
        if (!empty($attributes['limit'])) {
            $feePolicie = $this->paginate($attributes['limit']);
        } else {
            $feePolicie = $this->get();
        }

        return $feePolicie;
    }

    public function create(array $attributes)
    {
        $schoolYearId = SchoolYear::where('school_year_clover_id', $attributes['school_year_id'])->first();

        if (!is_null($schoolYearId)) {
            $schoolYearClover = $attributes['school_year_id'];

            $attributes['school_year_id'] = $schoolYearId->id;
            $feePolicie = $this->model->create($attributes);

            $feePolicieCreate = $feePolicie->toArray();
            $feePolicieCreate['schoolYearId'] = $schoolYearClover;
            $feePolicieCreate['FeePolicieCrmId'] = $feePolicie->id;

            FeePolicieCloverService::created($feePolicieCreate);

            return $this->parserResult($feePolicie);
        }

        return [];
    }

    public function update(array $attributes, $id)
    {
        $schoolYearId = SchoolYear::where('school_year_clover_id', $attributes['school_year_id'])->first();

        if (!is_null($schoolYearId)) {
            $attributes['school_year_id'] = $schoolYearId->id;

            return parent::update($attributes, $id);
        }

        return [];
    }

    public function getFeePolicieClover()
    {
        FeePolicieCloverService::result();
    }
}
