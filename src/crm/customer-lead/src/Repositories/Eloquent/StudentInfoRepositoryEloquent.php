<?php

namespace GGPHP\Crm\CustomerLead\Repositories\Eloquent;

use GGPHP\Crm\CustomerLead\Models\EventInfo;
use GGPHP\Crm\CustomerLead\Models\StudentInfo;
use GGPHP\Crm\CustomerLead\Presenters\StudentInfoPresenter;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\StudentInfoRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class EventInfoRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class StudentInfoRepositoryEloquent extends BaseRepository implements StudentInfoRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at',
    ];
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return StudentInfo::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function presenter()
    {
        return StudentInfoPresenter::class;
    }

    public function getStudentInfo(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $studentInfo = $this->paginate($attributes['limit']);
        } else {
            $studentInfo = $this->get();
        }

        return $studentInfo;
    }

    public function create(array $attributes)
    {

        if (!empty($attributes['createRows'])) {
            foreach ($attributes['createRows'] as $value) {
                StudentInfo::create($value);
            }
        }

        if (!empty($attributes['updateRows'])) {
            foreach ($attributes['updateRows'] as $value) {
                $updateStudentInfo = StudentInfo::find($value['id']);
                $updateStudentInfo->update($value);
            }
        }

        if (!empty($attributes['deleteRows'])) {
            StudentInfo::whereIn('id', $attributes['deleteRows'])->delete();
        }

        return parent::all();
    }
}
