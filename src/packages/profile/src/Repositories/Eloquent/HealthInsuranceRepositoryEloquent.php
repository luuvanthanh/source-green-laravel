<?php

namespace GGPHP\Profile\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Profile\Models\HealthInsurance;
use GGPHP\Profile\Presenters\HealthInsurancePresenter;
use GGPHP\Profile\Repositories\Contracts\HealthInsuranceRepository;

/**
 * Class InsurranceRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class HealthInsuranceRepositoryEloquent extends CoreRepositoryEloquent implements HealthInsuranceRepository
{
    protected $excelExporterServices;

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'id',
        'InsurranceNumber' => 'like',
        'employee.FullName' => 'like',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return HealthInsurance::class;
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
        return HealthInsurancePresenter::class;
    }

    public function getAll(array $attributes)
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

        if (!empty($attributes['limit'])) {
            $healthInsurrance = $this->paginate($attributes['limit']);
        } else {
            $healthInsurrance = $this->get();
        }

        return $healthInsurrance;
    }

    public function createOrUpdate(array $attributes)
    {
        $healthInsurrance = HealthInsurance::where('EmployeeId', $attributes['employeeId'])->first();

        if (empty($healthInsurrance)) {
            HealthInsurance::create($attributes);
        }

        if (!empty($healthInsurrance)) {
            $healthInsurrance->update($attributes);
        }

        $healthInsurrance = HealthInsurance::orderBy('Id')->get();

        return parent::parserResult($healthInsurrance);
    }
}
