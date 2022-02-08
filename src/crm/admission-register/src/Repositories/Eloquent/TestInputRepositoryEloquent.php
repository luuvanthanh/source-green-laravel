<?php

namespace GGPHP\Crm\AdmissionRegister\Repositories\Eloquent;

use GGPHP\Crm\AdmissionRegister\Models\AdmissionRegister;
use GGPHP\Crm\AdmissionRegister\Models\TestInput;
use GGPHP\Crm\AdmissionRegister\Models\TestInputDetail;
use GGPHP\Crm\AdmissionRegister\Models\TestInputDetailChildren;
use GGPHP\Crm\AdmissionRegister\Presenters\TestInputPresenter;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\TestInputRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TestInputRepositoryEloquent extends BaseRepository implements TestInputRepository
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
        return TestInput::class;
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
        return TestInputPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['admission_register_id'])) {
            $this->model = $this->model->where('admission_register_id', $attributes['admission_register_id']);
        }

        if (!empty($attributes['status'])) {
            $this->model = $this->model->whereIn('status', $attributes['status']);
        }

        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereHas('admissionRegister', function ($q) use ($attributes) {
                $q->whereHas('studentInfo', function ($query) use ($attributes) {
                    $query->whereLike('full_name', $attributes['key']);
                });
            });
        }

        if (!empty($attributes['branch_id'])) {
            $this->model = $this->model->whereHas('admissionRegister', function ($query) use ($attributes) {
                $query->where('branch_id', $attributes['branch_id']);
            });
        }

        if (!empty($attributes['employee_id'])) {
            $this->model = $this->model->where('employee_id', $attributes['employee_id']);
        }

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where('created_at', '>=', $attributes['startDate'])->where('created_at', '<=', $attributes['endDate']);
        }

        if (isset($attributes['age'])) {
            $this->model = $this->model->whereHas('testInputDetail', function ($q) use ($attributes) {
                $q->whereHas('testInputDetailChildren', function ($q1) use ($attributes) {
                    $q1->whereHas('childEvaluate', function ($query) use ($attributes) {
                        $query->where('age', $attributes['age']);
                    });
                });
            });
        }

        if (!empty($attributes['approvalStatus'])) {
            $this->model = $this->model->where('approval_status', $attributes['approvalStatus']);
        }

        if (!empty($attributes['class_type_id'])) {
            $this->model = $this->model->where('class_type_id', $attributes['class_type_id']);
        }

        if (!empty($attributes['limit'])) {
            $testInput = $this->paginate($attributes['limit']);
        } else {
            $testInput = $this->get();
        }

        return $testInput;
    }

    public function createOrUpdate(array $attributes)
    {
        $testInput = TestInput::where('admission_register_id', $attributes['admission_register_id'])->first();

        if (is_null($testInput)) {
            $testInput = TestInput::create($attributes);
        }

        if (!is_null($testInput)) {
            $testInput->update($attributes);
        }

        if (!empty($attributes['approval_status'])) {
            $testInput->update([
                'approval_status' => $attributes['approval_status']
            ]);
        }

        return parent::all();
    }

    public function testInputDetail(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $testInput = TestInput::where('admission_register_id', $attributes['admission_register_id'])->first();

            if (!empty($attributes['detail'])) {

                TestInputDetail::where('category_skill_id', $attributes['detail']['category_skill_id'])->delete();
                $attributes['detail']['test_input_id'] = $testInput->id;
                $attributes['detail']['status'] = TestInputDetail::STATUS[$attributes['detail']['status']];

                if (!empty($attributes['detail']['is_check'])) {

                    $testInputDetail = TestInputDetail::create($attributes['detail']);
                    foreach ($attributes['detail']['is_check'] as $value) {
                        $value['test_input_detail_id'] = $testInputDetail->id;
                        TestInputDetailChildren::create($value);
                    }
                }
                $testInput->status = TestInput::STATUS[$attributes['status']];
                $testInput->update();

                if (TestInput::STATUS[$attributes['status']] == 3) {
                    $testInput->testInputDetail()->delete();
                }
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($testInput->id);
    }
}
