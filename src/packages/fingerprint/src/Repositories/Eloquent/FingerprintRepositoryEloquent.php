<?php

namespace GGPHP\Fingerprint\Repositories\Eloquent;

use GGPHP\Fingerprint\Models\Fingerprint;
use GGPHP\Fingerprint\Presenters\FingerprintPresenter;
use GGPHP\Fingerprint\Repositories\Contracts\FingerprintRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class FingerprintRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class FingerprintRepositoryEloquent extends BaseRepository implements FingerprintRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'id',
        'employee.full_name' => 'like',
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
        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->where('created_at', '>=', $attributes['start_date'])->where('created_at', '<=', $attributes['end_date']);
        }

        if (!empty($attributes['limit'])) {
            $fingerprint = $this->paginate($attributes['limit']);
        } else {
            $fingerprint = $this->get();
        }

        return $fingerprint;
    }
}
