<?php

namespace GGPHP\WorkOnline\Repositories\Eloquents;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\WorkOnline\Models\WorkOnline;
use GGPHP\WorkOnline\Models\WorkOnlineDetail;
use GGPHP\WorkOnline\Presenters\WorkOnlinePresenter;
use GGPHP\WorkOnline\Repositories\Contracts\WorkOnlineRepository;
use GGPHP\WorkOnline\Services\WorkOnlineDetailServices;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class WorkOnlineRepositoryEloquent.
 *
 * @package GGPHP\WorkOnline\Repositories\Eloquents;
 */
class WorkOnlineRepositoryEloquent extends CoreRepositoryEloquent implements WorkOnlineRepository
{
    /**
     * @var array
     */
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
        return WorkOnline::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return WorkOnlinePresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Get all entity in repository
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function index(array $attributes)
    {
        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        if (!empty($attributes['fullName'])) {
            $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['fullName']);
            });
        }

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where(function ($q2) use ($attributes) {
                $q2->where([['StartDate', '<=', $attributes['startDate']], ['EndDate', '>=', $attributes['endDate']]])
                    ->orWhere([['StartDate', '>=', $attributes['startDate']], ['StartDate', '<=', $attributes['endDate']]])
                    ->orWhere([['EndDate', '>=', $attributes['startDate']], ['EndDate', '<=', $attributes['endDate']]]);
            });
        }

        if (!empty($attributes['limit'])) {
            $results = $this->paginate($attributes['limit']);
        } else {
            $results = $this->get();
        }

        return $results;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $workOnline = WorkOnline::create($attributes);

            if (!empty($attributes['detail'])) {

                foreach ($attributes['detail'] as $value) {
                    $value['WorkOnlineId'] = $workOnline->Id;
                    WorkOnlineDetail::create($value);
                }
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::all();
    }

    public function update(array $attributes, $id)
    {
        $workOnline = WorkOnline::findOrFail($id);

        \DB::beginTransaction();
        try {

            $workOnline->update($attributes);
            $workOnline->workOnlineDetail()->delete();
            WorkOnlineDetailServices::add($id, $attributes['detail']);

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($id);
    }
}
