<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\TypeOfContract;
use GGPHP\Category\Presenters\TypeOfContractPresenter;
use GGPHP\Category\Repositories\Contracts\TypeOfContractRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class TypeOfContractRepositoryEloquent.
 *
 * @package namespace GGPHP\Category\Repositories\Eloquent;
 */
class TypeOfContractRepositoryEloquent extends BaseRepository implements TypeOfContractRepository
{
    protected $fieldSearchable = [
        'id',
        'name' => 'like',
        'code' => 'like',
        'type',
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

            $tranfer->parameterValues()->attach($attributes['param_value']);

            $tranfer->parameterFormulas()->attach($attributes['param_formula']);

            \DB::commit();
        } catch (\Exception $e) {

            \DB::rollback();
        }

        return parent::find($tranfer->id);
    }
}
