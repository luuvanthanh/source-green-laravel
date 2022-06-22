<?php

namespace GGPHP\Refund\Repositories\Eloquents;

use Exception;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Refund\Models\RefundStudent;
use GGPHP\Refund\Models\StudentRefundDetail;
use GGPHP\Refund\Presenters\RefundStudentPresenter;
use GGPHP\Refund\Repositories\Contracts\RefundStudentRepository;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class RefundRepositoryEloquent.
 *
 * @package GGPHP\Refund\Repositories\Eloquents;
 */
class RefundStudentRepositoryEloquent extends CoreRepositoryEloquent implements RefundStudentRepository
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
        return RefundStudent::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return RefundStudentPresenter::class;
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
            $refundStudent = $this->model->create($attributes);
            collect($attributes['listStudent'])->each(function ($item) use ($refundStudent) {
                $studentRefundDetail = $this->createStudentRefundDetail($refundStudent, $item);
                $this->createRefundFee($studentRefundDetail, $item['refund']);
            });
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            
            throw new Exception($th->getMessage(), $th->getCode());
        }

        return $this->parserResult($refundStudent);
    }

    public function createStudentRefundDetail(RefundStudent $refundStudent, $attributes)
    {
        foreach ($attributes as $key => $item) {
            $newkey = dashesToCamelCase($key, true);

            if ($key != $newkey) {
                $attributes[$newkey] = $attributes[$key];
                unset($attributes[$key]);
            }
        }

        return $refundStudent->studentRefundDetail()->create($attributes);
    }

    public function createRefundFee(StudentRefundDetail $studentRefundDetail, $attributes)
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

        return $studentRefundDetail->refundFee()->createMany($attributes);
    }
}
