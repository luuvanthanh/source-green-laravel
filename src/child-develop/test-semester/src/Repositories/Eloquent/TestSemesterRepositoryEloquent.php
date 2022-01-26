<?php

namespace GGPHP\ChildDevelop\TestSemester\Repositories\Eloquent;

use GGPHP\ChildDevelop\TestSemester\Presenters\TestSemesterPresenter;
use GGPHP\ChildDevelop\TestSemester\Repositories\Contracts\TestSemesterRepository;
use GGPHP\ChildDevelop\TestSemester\Models\TestSemester;
use GGPHP\ChildDevelop\TestSemester\Models\TestSemesterDetail;
use GGPHP\ChildDevelop\TestSemester\Models\TestSemesterDetailChildren;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TestSemesterRepositoryEloquent extends BaseRepository implements TestSemesterRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id', 'CreationTime'
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return TestSemester::class;
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
        return TestSemesterPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['status'])) {
            $this->model = $this->model->whereIn('status', $attributes['status']);
        }

        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereHas('student', function ($q) use ($attributes) {
                $q->whereLike('FullName', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $testSemester = $this->paginate($attributes['limit']);
        } else {
            $testSemester = $this->get();
        }

        return $testSemester;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {

            $testSemester = TestSemester::where('StudentId', $attributes['studentId'])->where('AssessmentPeriodId', $attributes['assessmentPeriodId'])->first();

            if (is_null($testSemester)) {
                $attributes['status'] = TestSemester::STATUS[$attributes['status']];
                $testSemester = TestSemester::create($attributes);
            } else {
                $attributes['status'] = TestSemester::STATUS[$attributes['status']];
                $testSemester->update($attributes);
            }

            if ($attributes['detail']['isCheck']) {

                TestSemesterDetail::where('CategorySkillId', $attributes['detail']['categorySkillId'])->delete();
                $attributes['detail']['testSemesterId'] = $testSemester->Id;
                $attributes['detail']['status'] = TestSemesterDetail::STATUS[$attributes['detail']['status']];
                $testSemesterDetail = TestSemesterDetail::create($attributes['detail']);

                foreach ($attributes['detail']['isCheck'] as $value) {
                    $value['testSemesterDetailId'] = $testSemesterDetail->Id;
                    TestSemesterDetailChildren::create($value);
                }
            }

            if ($attributes['status'] == 3) {
                $testSemester->testSemesterDetail()->delete();
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($testSemester->Id);
    }
}
