<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\TypeOfContract;
use GGPHP\Category\Presenters\TypeOfContractPresenter;
use GGPHP\Category\Repositories\Contracts\TypeOfContractRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class TypeOfContractRepositoryEloquent.
 *
 * @package namespace GGPHP\Category\Repositories\Eloquent;
 */
class TypeOfContractRepositoryEloquent extends CoreRepositoryEloquent implements TypeOfContractRepository
{
    protected $fieldSearchable = [
        'Id',
        'Name' => 'like',
        'Code' => 'like',
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
        return TypeOfContract::class;
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
        return TypeOfContractPresenter::class;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $typeOfContract = TypeOfContract::create($attributes);

            $typeOfContract->parameterValues()->attach($attributes['paramValue']);

            // $typeOfContract->parameterFormulas()->attach($attributes['paramFormula']);

            \DB::commit();
        } catch (\Exception $e) {

            \DB::rollback();
        }

        return parent::find($typeOfContract->Id);
    }

    public function update(array $attributes, $id)
    {
        $typeOfContract = TypeOfContract::findOrFail($id);

        \DB::beginTransaction();
        try {
            $typeOfContract->update($attributes);

            if (!empty($attributes['paramValue'])) {
                $typeOfContract->parameterValues()->detach();
                $typeOfContract->parameterValues()->attach($attributes['paramValue']);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($typeOfContract->Id);
    }

    public function getTypeOfContract(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $typeOfContract = $this->paginate($attributes['limit']);
        } else {
            $typeOfContract = $this->get();
        }

        return $typeOfContract;
    }
}
