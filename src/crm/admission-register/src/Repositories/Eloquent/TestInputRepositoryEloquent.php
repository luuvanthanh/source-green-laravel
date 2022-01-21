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
            $testInput->update();
        }

        if (!is_null($testInput)) {
            $testInput->update($attributes);
        }

        return parent::all();
    }

    public function testInputDetail(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $testInput = TestInput::where('admission_register_id', $attributes['admission_register_id'])->first();

            if (!empty($attributes['detail'])) {
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
