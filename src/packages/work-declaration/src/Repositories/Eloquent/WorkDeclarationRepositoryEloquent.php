<?php

namespace GGPHP\WorkDeclaration\Repositories\Eloquent;

use GGPHP\WorkDeclaration\Models\WorkDeclaration;
use GGPHP\WorkDeclaration\Presenters\WorkDeclarationPresenter;
use GGPHP\WorkDeclaration\Repositories\Contracts\WorkDeclarationRepository;
use GGPHP\WorkDeclaration\Services\WorkDeclarationDetailService;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class WorkDeclarationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class WorkDeclarationRepositoryEloquent extends BaseRepository implements WorkDeclarationRepository
{
    protected $fieldSearchable = [
        'id',
        'employee_id',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return WorkDeclaration::class;
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
        return WorkDeclarationPresenter::class;
    }

    public function create(array $attributes)
    {
        $workDeclaration = WorkDeclaration::create($attributes);

        WorkDeclarationDetailService::add($workDeclaration->id, $attributes['data']);

        return parent::find($workDeclaration->id);
    }

    public function getWorkDeclaration(array $attributes)
    {
        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->where('created_at', '>=', $attributes['start_date'])->where('created_at', '<=', $attributes['end_date']);
        }

        if (!empty($attributes['is_filter'])) {
            $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
                $query->tranferHistory($attributes);
            });
        }

        if (!empty($attributes['employee_id'])) {
            $employeeId = explode(',', $attributes['employee_id']);
            $this->model = $this->model->whereIn('employee_id', $employeeId);
        }

        if (!empty($attributes['limit'])) {
            $workDeclaration = $this->paginate($attributes['limit']);
        } else {
            $workDeclaration = $this->get();
        }

        return $workDeclaration;
    }

    public function update(array $attributes, $id)
    {
        $workDeclaration = WorkDeclaration::findOrFail($id);

        $workDeclaration->update($attributes);

        WorkDeclarationDetailService::update($attributes['data']);

        return parent::find($id);
    }
}
