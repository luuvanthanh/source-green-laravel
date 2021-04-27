<?php

namespace GGPHP\Children\Repositories\Eloquents;

use Carbon\Carbon;
use GGPHP\Children\Models\Children;
use GGPHP\Children\Presenters\ChildrenPresenter;
use GGPHP\Children\Repositories\Contracts\ChildrenRepository;
use GGPHP\Users\Models\User;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class ChildrenRepositoryEloquent.
 *
 * @package GGPHP\Children\Repositories\Eloquents;
 */
class ChildrenRepositoryEloquent extends BaseRepository implements ChildrenRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'parent_id',
        'full_name' => 'like',
        'gender',
        'birthday',
        'status',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Children::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return ChildrenPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Save many entity in repository
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function createMany(array $attributes)
    {
        $parent = User::findOrFail($attributes['employeeId']);

        $children = $parent->children()->createMany($attributes['data']);

        return $this->parserResult($children);
    }

    /**
     * Get all entity in repository
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function index($request)
    {

        $this->whereHas('employee', function ($query) use ($request) {

            if ($request->has('employeeId')) {
                $employeeId = explode(',', $request->employeeId);
                $this->model = $this->model->whereIn('Id', $employeeId);
            }

            $query->tranferHistory($request->all());
        });

        if ($request->has('startMonth')) {
            $startDate = Carbon::now()->subMonths($request->startMonth)->format('Y-m-d');
            $this->whereDate('Birthday', '<=', $startDate);
        }

        if ($request->has('endMonth')) {
            $endDate = Carbon::now()->subMonths($request->endMonth)->format('Y-m-d');
            $this->whereDate('Birthday', '>=', $endDate);
        }

        if ($request->has('limit')) {
            $results = $this->paginate($request->limit);
        } else {
            $results = $this->get();
        }

        return $results;
    }
}
