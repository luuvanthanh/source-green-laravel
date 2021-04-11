<?php

namespace GGPHP\Transfer\Repositories\Eloquent;

use GGPHP\Transfer\Models\Transfer;
use GGPHP\Transfer\Presenters\TransferPresenter;
use GGPHP\Transfer\Repositories\Contracts\TransferRepository;
use GGPHP\Transfer\Services\TransferDetailServices;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class TransferRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TransferRepositoryEloquent extends BaseRepository implements TransferRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'id',
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
            TransferDetailServices::add($tranfer->id, $attributes['data']);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($tranfer->id);
    }

    public function getTransfer(array $attributes)
    {
        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->whereDate('created_at', '>=', $attributes['start_date'])->whereDate('created_at', '<=', $attributes['end_date']);
        }

        if (!empty($attributes['limit'])) {
            $transfer = $this->paginate($attributes['limit']);
        } else {
            $transfer = $this->get();
        }

        return $transfer;
    }
}
