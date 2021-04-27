<?php

namespace GGPHP\Profile\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Presenters\LabourContractPresenter;
use GGPHP\Profile\Repositories\Contracts\LabourContractRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class LabourContractRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class LabourContractRepositoryEloquent extends CoreRepositoryEloquent implements LabourContractRepository
{
    protected $wordExporterServices;

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'EmployeeId',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return LabourContract::class;
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
        return LabourContractPresenter::class;
    }

    public function getLabourContract(array $attributes)
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
            $labourContract = $this->paginate($attributes['limit']);
        } else {
            $labourContract = $this->get();
        }

        return $labourContract;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $tranfer = LabourContract::create($attributes);
            foreach ($attributes['detail'] as $value) {
                $tranfer->parameterValues()->attach($value['parameterValueId'], ['Value' => $value['value']]);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($tranfer->Id);
    }
}
