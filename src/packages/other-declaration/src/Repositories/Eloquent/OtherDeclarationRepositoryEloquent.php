<?php

namespace GGPHP\OtherDeclaration\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\OtherDeclaration\Models\OtherDeclaration;
use GGPHP\OtherDeclaration\Presenters\OtherDeclarationPresenter;
use GGPHP\OtherDeclaration\Repositories\Contracts\OtherDeclarationRepository;
use GGPHP\OtherDeclaration\Services\OtherDeclarationDetailServices;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class OtherDeclarationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class OtherDeclarationRepositoryEloquent extends CoreRepositoryEloquent implements OtherDeclarationRepository
{
    protected $fieldSearchable = [
        'Id',
        'Time',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return OtherDeclaration::class;
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
        return OtherDeclarationPresenter::class;
    }

    public function filterOtherDeclaration(array $attributes)
    {

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereHas('otherDeclarationDetail', function ($query) use ($employeeId) {
                $query->whereIn('EmployeeId', $employeeId);
            });
        }

        if (!empty($attributes['fullName'])) {
            $this->model = $this->model->whereHas('otherDeclarationDetail', function ($query) use ($attributes) {
                $query->whereHas('employee', function ($q2) use ($attributes) {
                    $q2->whereLike('FullName', $attributes['fullName']);
                });
            });
        }

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where('Time', '>=', $attributes['startDate'])->where('Time', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['limit'])) {
            $otherDeclaration = $this->paginate($attributes['limit']);
        } else {
            $otherDeclaration = $this->get();
        }

        return $otherDeclaration;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $otherDeclaration = OtherDeclaration::create($attributes);

            OtherDeclarationDetailServices::add($otherDeclaration->Id, $attributes['detail']);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw new HttpException(500, $e->getMessage());
        }

        return parent::find($otherDeclaration->Id);
    }

    public function update(array $attributes, $id)
    {
        $otherDeclaration = OtherDeclaration::findOrFail($id);

        \DB::beginTransaction();
        try {
            $otherDeclaration->update($attributes);

            $otherDeclaration->otherDeclarationDetail()->delete();

            OtherDeclarationDetailServices::add($otherDeclaration->Id, $attributes['detail']);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw new HttpException(500, $e->getMessage());
        }

        return parent::find($otherDeclaration->Id);
    }
}
