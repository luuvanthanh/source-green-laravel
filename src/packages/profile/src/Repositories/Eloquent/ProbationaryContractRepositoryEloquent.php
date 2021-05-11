<?php

namespace GGPHP\Profile\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Profile\Models\ProbationaryContract;
use GGPHP\Profile\Presenters\ProbationaryContractPresenter;
use GGPHP\Profile\Repositories\Contracts\ProbationaryContractRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ProbationaryContractRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ProbationaryContractRepositoryEloquent extends CoreRepositoryEloquent implements ProbationaryContractRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'employee.FullName' => 'like',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ProbationaryContract::class;
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
        return ProbationaryContractPresenter::class;
    }

    public function getProbationaryContract(array $attributes)
    {
        if (!empty($attributes['status'])) {

            switch ($attributes['status']) {
                case 'DANG_HIEU_LUC':
                    $now = Carbon::now();
                    $addMonth = Carbon::now()->addMonth();

                    $this->model = $this->model->where('ContractFrom', '<=', $now->format('Y-m-d'))->where('ContractTo', '>', $addMonth->format('Y-m-d'));
                    break;
                case 'GAN_HET_HAN':
                    $now = Carbon::now();
                    $addMonth = Carbon::now()->addMonth();

                    $this->model = $this->model->where('ContractTo', '>=', $now->format('Y-m-d'))->where('ContractTo', '<=', $addMonth->format('Y-m-d'));
                    break;
                case 'DA_HET_HAN':
                    $now = Carbon::now();

                    $this->model = $this->model->where('ContractTo', '<', $now->format('Y-m-d'));
                    break;
                case 'CHUA_DEN_HAN':
                    $now = Carbon::now();

                    $this->model = $this->model->where('ContractFrom', '>', $now->format('Y-m-d'));
                    break;
                default:
                    break;
            }
        }

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where('ContractDate', '>=', Carbon::parse($attributes['startDate'])->format('Y-m-d'))->where('ContractDate', '<=', Carbon::parse($attributes['endDate'])->format('Y-m-d'));
        }

        if (!empty($attributes['limit'])) {
            $probationaryContract = $this->paginate($attributes['limit']);
        } else {
            $probationaryContract = $this->get();
        }

        return $probationaryContract;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $probationaryContract = ProbationaryContract::create($attributes);
            foreach ($attributes['detail'] as $value) {
                $probationaryContract->parameterValues()->attach($value['parameterValueId'], ['Value' => $value['value']]);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($probationaryContract->Id);
    }

    public function update(array $attributes, $id)
    {
        $probationaryContract = ProbationaryContract::findOrFail($id);

        \DB::beginTransaction();
        try {
            $probationaryContract->update($attributes);

            $probationaryContract->parameterValues()->detach();
            foreach ($attributes['detail'] as $value) {
                $probationaryContract->parameterValues()->attach($value['parameterValueId'], ['Value' => $value['value']]);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($probationaryContract->Id);
    }
}
