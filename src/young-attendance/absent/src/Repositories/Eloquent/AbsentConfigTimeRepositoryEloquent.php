<?php

namespace GGPHP\YoungAttendance\Absent\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\YoungAttendance\Absent\Http\Requests\AbsentConfigTimeCreateRequest;
use GGPHP\YoungAttendance\Absent\Models\AbsentConfigTime;
use GGPHP\YoungAttendance\Absent\Presenters\AbsentConfigTimePresenter;
use GGPHP\YoungAttendance\Absent\Repositories\Absent\AbsentConfigTimeRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class AbsentConfigTimeRepositoryEloquent.
 *
 * @package namespace GGPHP\YoungAttendance\Absent\Repositories\Eloquent;
 */
class AbsentConfigTimeRepositoryEloquent extends CoreRepositoryEloquent implements AbsentConfigTimeRepository
{
    protected $fieldSearchable = [
        'From',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return AbsentConfigTime::class;
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
        return AbsentConfigTimePresenter::class;
    }


    /**
     * updateOrCreate AbsentConfigTime
     * @param array $attributes
     * @return mixed|void
     */
    public function createOrUpdate(array $attributes)
    {
        if (!empty($attributes['delete_rows'])) {
            AbsentConfigTime::whereIn('id', $attributes['delete_ids'])->delete();
        }

        if (!empty($attributes['update_rows'])) {
            foreach ($attributes['update_rows'] as $value) {
                $absentConfigTime = AbsentConfigTime::find($value['id']);
                if ($absentConfigTime) {
                    $absentConfigTime->update($value);
                }
            }
        }

        if (!empty($attributes['create_rows'])) {
            foreach ($attributes['create_rows'] as $value) {
                AbsentConfigTime::create($value);
            }
        }

        $result = AbsentConfigTime::orderBy('From')->get();

        return parent::parserResult($result);
    }
}
