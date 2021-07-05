<?php

namespace GGPHP\Fee\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Models\ChargeStudent;
use GGPHP\Fee\Presenters\ChargeStudentPresenter;
use GGPHP\Fee\Repositories\Contracts\ChargeStudentRepository;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class ChargeStudentRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ChargeStudentRepositoryEloquent extends CoreRepositoryEloquent implements ChargeStudentRepository
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
        return ChargeStudent::class;
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
        return ChargeStudentPresenter::class;
    }

    public function filterChargeStudent(array $attributes)
    {
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
            $chargeStudent = ChargeStudent::create($attributes);

            \GGPHP\Fee\Models\PotentialStudent::create($attributes);

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
            $chargeStudent = ChargeStudent::findOrFail($id);

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
