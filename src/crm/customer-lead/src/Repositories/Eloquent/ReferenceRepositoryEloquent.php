<?php

namespace GGPHP\Crm\CustomerLead\Repositories\Eloquent;

use GGPHP\Crm\CustomerLead\Models\Reference;
use GGPHP\Crm\CustomerLead\Presenters\ReferencePresenter;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\ReferenceRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ReferenceRepositoryEloquent extends BaseRepository implements ReferenceRepository
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
        return Reference::class;
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
        return ReferencePresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['customer_lead_id'])) {
            $this->model = $this->model->where('customer_lead_id', $attributes['customer_lead_id']);
        }

        if (!empty($attributes['limit'])) {
            $reference = $this->paginate($attributes['limit']);
        } else {
            $reference = $this->get();
        }

        return $reference;
    }

    public function create(array $attributes)
    {
        $referenceId = Reference::where('customer_lead_id', $attributes['customer_lead_id'])->first();
        \DB::beginTransaction();
        try {

            if (is_null($referenceId)) {
                Reference::create($attributes);
            }

            if (!is_null($referenceId)) {
                $referenceId->update($attributes);
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::all();
    }
}
