<?php

namespace GGPHP\Refund\Repositories\Eloquents;

use Exception;
use GGPHP\Refund\Models\Refund;
use GGPHP\Refund\Presenters\RefundPresenter;
use GGPHP\Refund\Repositories\Contracts\RefundRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Refund\Models\RefundDetail;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;
use Throwable;

/**
 * Class RefundRepositoryEloquent.
 *
 * @package GGPHP\Refund\Repositories\Eloquents;
 */
class RefundRepositoryEloquent extends CoreRepositoryEloquent implements RefundRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Refund::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return RefundPresenter::class;
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
        if (!empty($attributes['limit'])) {
            $results = $this->paginate($attributes['limit']);
        } else {
            $results = $this->get();
        }

        return $results;
    }

    public function createMany(array $attributes)
    {
        try {
            DB::beginTransaction();
            $model = $this->model->create($attributes);

            if (!empty($attributes['createRefundDetailRows'])) {
                collect($attributes['createRefundDetailRows'])->each(function ($item) use ($model) {
                    $refundDetail = $this->refundDetailCreate($item, $model);

                    $this->refundDetailCreated($item['configRefund'], $refundDetail);
                });
            }

            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();
            throw new Exception($th->getMessage(), $th->getCode());
        }

        return $this->parserResult($model);
    }

    public function updateMany(array $attributes, $id)
    {
        try {
            DB::beginTransaction();
            $model = $this->model->findOrFail($id);

            $model->update($attributes);
            if (!empty($attributes['createRefundDetailRows'])) {
                collect($attributes['createRefundDetailRows'])->each(function ($item) use ($model) {
                    $refundDetail = $this->refundDetailCreate($item, $model);

                    $this->refundDetailCreated($item['configRefund'], $refundDetail);
                });
            }

            if (!empty($attributes['updateRefundDetailRows'])) {
                collect($attributes['updateRefundDetailRows'])->each(function ($item) use ($model) {
                    $refundDetail = $this->refundDetailUpdate($item, $model);

                    collect($item['configRefund'])->each(function ($item) use ($refundDetail) {
                        $this->refundDetailUpdated($item, $refundDetail);
                    });
                });
            }

            if (!empty($attributes['deleteRefundDetailRows'])) {
                $model->refundDetail()->whereIn('Id', $attributes['deleteRefundDetailRows'])->delete();
            }

            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();
            throw new Exception($th->getMessage(), $th->getCode());
        }

        return $this->parserResult($model);
    }

    public function refundDetailUpdate(array $attributes, $model)
    {
        $refundDetail = $model->refundDetail()->find($attributes['refundDetailId']);

        $refundDetail->update($attributes);

        return $refundDetail;
    }

    public function refundDetailUpdated(array $attributes, $model)
    {
        $model->configRefund()->find($attributes['configRefundId'])->update($attributes);
    }

    public function refundDetailCreate(array $attributes, $model)
    {
        $attributes['RefundId'] = $model->Id;

        $refundDetail = RefundDetail::create($attributes);

        return $refundDetail;
    }

    public function refundDetailCreated(array $attributes, $model)
    {
        foreach ($attributes as &$item) {
            foreach ($item as $key => $value) {
                $newkey = dashesToCamelCase($key, true);

                if ($key != $newkey) {
                    $item[$newkey] = $item[$key];
                    unset($item[$key]);
                }
            }
        }
        
        $model->configRefund()->createMany($attributes);
    }
}
