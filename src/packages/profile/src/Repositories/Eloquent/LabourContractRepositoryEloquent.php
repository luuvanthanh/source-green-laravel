<?php

namespace GGPHP\Profile\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Presenters\LabourContractPresenter;
use GGPHP\Profile\Repositories\Contracts\LabourContractRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class LabourContractRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class LabourContractRepositoryEloquent extends BaseRepository implements LabourContractRepository
{
    protected $wordExporterServices;

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'id',
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

                    $this->model = $this->model->where('contract_from', '<=', $now->format('Y-m-d'))->where('contract_to', '>', $addMonth->format('Y-m-d'));
                    break;
                case 'GAN_HET_HAN':
                    $now = Carbon::now();
                    $addMonth = Carbon::now()->addMonth();

                    $this->model = $this->model->where('contract_to', '>=', $now->format('Y-m-d'))->where('contract_to', '<=', $addMonth->format('Y-m-d'));
                    break;
                case 'DA_HET_HAN':
                    $now = Carbon::now();

                    $this->model = $this->model->where('contract_to', '<', $now->format('Y-m-d'));
                    break;
                case 'CHUA_DEN_HAN':
                    $now = Carbon::now();

                    $this->model = $this->model->where('contract_from', '>', $now->format('Y-m-d'));
                    break;
                default:
                    break;
            }
        }

        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->where('contract_date', '>=', Carbon::parse($attributes['start_date'])->format('Y-m-d'))->where('contract_date', '<=', Carbon::parse($attributes['end_date'])->format('Y-m-d'));
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
                $tranfer->parameterValues()->attach($value['parameter_value_id'], ['value' => $value['value']]);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($tranfer->id);
    }
}
