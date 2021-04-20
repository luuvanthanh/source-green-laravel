<?php

namespace GGPHP\Fingerprint\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fingerprint\Models\Fingerprint;
use GGPHP\Fingerprint\Presenters\FingerprintPresenter;
use GGPHP\Fingerprint\Repositories\Contracts\FingerprintRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class FingerprintRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class FingerprintRepositoryEloquent extends CoreRepositoryEloquent implements FingerprintRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'Employee.FullName' => 'like',
        'status',
    ];
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Fingerprint::class;
    }

    public function presenter()
    {
        return FingerprintPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function delete($id)
    {
        $model = $this->skipPresenter()->find($id);

        $deleted = parent::delete($id);

        // if ($deleted) {
        //     $fingerprintTimekeepers = $model->employee->rankPositionInformation->store->fingerprintTimekeepers;
        //     \ZK\Services\WorkOnDevice::deleteFingerprint($model, $fingerprintTimekeepers);
        // }

        return true;
    }

    /**
     * Get all Magnetic Card
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function getAll(array $attributes)
    {
        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where('CreationTime', '>=', $attributes['startDate'])->where('CreationTime', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->where('EmployeeId', $employeeId);
        }

        if (!empty($attributes['limit'])) {
            $fingerprint = $this->paginate($attributes['limit']);
        } else {
            $fingerprint = $this->get();
        }

        return $fingerprint;
    }
}
