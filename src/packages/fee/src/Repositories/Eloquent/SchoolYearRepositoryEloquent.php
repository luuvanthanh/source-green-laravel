<?php

namespace GGPHP\Fee\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Models\SchoolYear;
use GGPHP\Fee\Presenters\SchoolYearPresenter;
use GGPHP\Fee\Repositories\Contracts\SchoolYearRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class SchoolYearRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class SchoolYearRepositoryEloquent extends CoreRepositoryEloquent implements SchoolYearRepository
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
        return SchoolYear::class;
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
        return SchoolYearPresenter::class;
    }

    public function filterSchoolYear(array $attributes)
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
        \DB::beginTransaction();
        try {
            $schoolYear = SchoolYear::create($attributes);

            if (!empty($attributes['fixedParameter'])) {
                foreach ($attributes['fixedParameter'] as $value) {

                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }

                    $schoolYear->fixedParameter()->create($value);
                }
            }

            if (!empty($attributes['changeParameter'])) {
                foreach ($attributes['changeParameter'] as $value) {

                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }

                    $schoolYear->changeParameter()->create($value);
                }
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
        }

        return parent::parserResult($schoolYear);
    }

    public function update(array $attributes, $id)
    {
        $schoolYear = SchoolYear::findOrFail($id);

        \DB::beginTransaction();
        try {
            $schoolYear->update($attributes);

            if (!empty($attributes['fixedParameter'])) {
                $schoolYear->fixedParameter()->delete();

                foreach ($attributes['fixedParameter'] as $value) {

                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }

                    $schoolYear->fixedParameter()->create($value);
                }
            }

            if (!empty($attributes['changeParameter'])) {
                $schoolYear->changeParamete()->delete();

                foreach ($attributes['changeParameter'] as $value) {

                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }

                    $schoolYear->changeParameter()->create($value);
                }
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
        }

        return parent::find($id);
    }
}
