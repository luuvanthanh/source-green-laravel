<?php

namespace GGPHP\WorkDeclaration\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\WorkDeclaration\Models\WorkDeclaration;
use GGPHP\WorkDeclaration\Presenters\WorkDeclarationPresenter;
use GGPHP\WorkDeclaration\Repositories\Contracts\WorkDeclarationRepository;
use GGPHP\WorkDeclaration\Services\WorkDeclarationDetailService;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class WorkDeclarationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class WorkDeclarationRepositoryEloquent extends CoreRepositoryEloquent implements WorkDeclarationRepository
{
    protected $fieldSearchable = [
        'Id',
        'EmployeeId',
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

        WorkDeclarationDetailService::add($workDeclaration->Id, $attributes['data']);

        return parent::find($workDeclaration->Id);
    }

    public function getWorkDeclaration(array $attributes)
    {
        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where('CreationTime', '>=', $attributes['startDate'])->where('CreationTime', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['is_filter'])) {
            $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
                $query->tranferHistory($attributes);
            });
        }

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
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
