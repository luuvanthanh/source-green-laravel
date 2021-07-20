<?php

namespace GGPHP\Fee\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Models\ChargeOldStudent;
use GGPHP\Fee\Presenters\ChargeOldStudentPresenter;
use GGPHP\Fee\Repositories\Contracts\ChargeOldStudentRepository;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class ChargeOldStudentRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ChargeOldStudentRepositoryEloquent extends CoreRepositoryEloquent implements ChargeOldStudentRepository
{
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
        return ChargeOldStudent::class;
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
        return ChargeOldStudentPresenter::class;
    }

    public function filterChargeOldStudent(array $attributes)
    {
        if (!empty($attributes['nameStudent'])) {
            $this->model = $this->model->whereHas('student', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['nameStudent']);
            });
        }

        if (!empty($attributes['from']) && !empty($attributes['to'])) {
            $this->model = $this->model->whereHas('schoolYear', function ($query) use ($attributes) {
                $query->where('YearFrom', $attributes['from'])->where('YearTo', $attributes['to']);
            });
        }

        if (!empty($attributes['limit'])) {
            $paymentForm = $this->paginate($attributes['limit']);
        } else {
            $paymentForm = $this->get();
        }

        return $paymentForm;
    }

    public function create(array $attributes)
    {
        DB::beginTransaction();
        try {
            $chargeStudent = ChargeOldStudent::create($attributes);

            $totalMoney = 0;
            if (!empty($attributes['tuition'])) {
                foreach ($attributes['tuition'] as $value) {

                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }
                    $totalMoney += $value['Money'];
                    $chargeStudent->tuition()->create($value);
                }
            }

            $chargeStudent->update(['TotalMoney' => $totalMoney]);

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($chargeStudent);
    }

    public function update(array $attributes, $id)
    {
        DB::beginTransaction();
        try {
            $chargeStudent = ChargeOldStudent::findOrFail($id);

            $chargeStudent->update($attributes);

            $totalMoney = 0;
            if (!empty($attributes['tuition'])) {
                $chargeStudent->tuition()->delete();

                foreach ($attributes['tuition'] as $value) {

                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }
                    $totalMoney += $value['Money'];
                    $chargeStudent->tuition()->create($value);
                }
            }

            $chargeStudent->update(['TotalMoney' => $totalMoney]);

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($id);
    }
}
