<?php

namespace GGPHP\Transfer\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Transfer\Models\Transfer;
use GGPHP\Transfer\Presenters\TransferPresenter;
use GGPHP\Transfer\Repositories\Contracts\TransferRepository;
use GGPHP\Transfer\Services\TransferDetailServices;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class TransferRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TransferRepositoryEloquent extends CoreRepositoryEloquent implements TransferRepository
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
        return Transfer::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return TransferPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $tranfer = Transfer::create($attributes);
            TransferDetailServices::add($tranfer->Id, $attributes['data']);

            \DB::commit();
        } catch (\Exception $e) {
            dd($e);
            \DB::rollback();
        }

        return parent::find($tranfer->Id);
    }

    public function getTransfer(array $attributes)
    {
        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->whereDate('CreationTime', '>=', $attributes['startDate'])->whereDate('CreationTime', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['employeeId'])) {
            $this->model = $this->model->whereHas('transferDetails', function ($query) use ($attributes) {
                $employeeId = explode(',', $attributes['employeeId']);
                $query->whereIn('EmployeeId', $employeeId);
            });
        }

        if (!empty($attributes['limit'])) {
            $transfer = $this->paginate($attributes['limit']);
        } else {
            $transfer = $this->get();
        }

        return $transfer;
    }
}
