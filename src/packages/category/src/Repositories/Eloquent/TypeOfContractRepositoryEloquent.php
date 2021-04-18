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
            $tranfer = TypeOfContract::create($attributes);

            $tranfer->parameterValues()->attach($attributes['paramValue']);

            $tranfer->parameterFormulas()->attach($attributes['paramFormula']);

            \DB::commit();
        } catch (\Exception $e) {
            dd($e);
            \DB::rollback();
        }

        return parent::find($tranfer->Id);
    }
}
