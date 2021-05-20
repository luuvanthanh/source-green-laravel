<?php

namespace GGPHP\Transfer\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Transfer\Models\Transfer;
use GGPHP\Transfer\Presenters\TransferPresenter;
use GGPHP\Transfer\Repositories\Contracts\TransferRepository;
use GGPHP\Transfer\Services\TransferDetailServices;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class TransferRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TransferRepositoryEloquent extends CoreRepositoryEloquent implements TransferRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'CreationTime',
    ];

    /**
     * @param Application $app
     * @param ExcelExporterServices $wordExporterServices
     */
    public function __construct(
        WordExporterServices $wordExporterServices,
        Application $app
    ) {
        parent::__construct($app);
        $this->wordExporterServices = $wordExporterServices;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Transfer::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return TransferPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $tranfer = Transfer::create($attributes);
            TransferDetailServices::add($tranfer->Id, $attributes['data']);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($tranfer->Id);
    }

    public function update(array $attributes, $id)
    {
        $tranfer = Transfer::findOrfail($id);
        \DB::beginTransaction();
        try {

            $tranfer->update($attributes);

            $tranfer->transferDetails()->delete();
            TransferDetailServices::add($tranfer->Id, $attributes['data']);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($tranfer->Id);
    }

    public function getTransfer(array $attributes)
    {
        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->whereDate('CreationTime', '>=', $attributes['startDate'])->whereDate('CreationTime', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['employeeId'])) {
            $this->model = $this->model->whereHas('transferDetails', function ($query) use ($attributes) {
                $employeeId = explode(',', $attributes['employeeId']);
                $query->whereIn('EmployeeId', $employeeId);
            });
        }

        if (!empty($attributes['limit'])) {
            $transfer = $this->paginate($attributes['limit']);
        } else {
            $transfer = $this->get();
        }

        return $transfer;
    }

    public function exportWord($id)
    {
        $transfer = Transfer::findOrFail($id);
        $now = Carbon::now();

        $detail = $transfer->transferDetails->first();
        $employee = $detail->employee;
        $labourContract = $employee->labourContract->last();

        $params = [
            'decisionNumber' => $transfer->DecisionNumber,
            'decisionNumberLabourContract' => $labourContract ? $labourContract->ContractNumber : '........',
            'date' => $labourContract ? $labourContract->ContractDate->format('d') : '.......',
            'month' => $labourContract ? $labourContract->ContractDate->format('m') : '.......',
            'year' => $labourContract ? $labourContract->ContractDate->format('Y') : '.......',
            'decisionDate' => $transfer->DecisionDate ? $transfer->DecisionDate->format('d-m-Y') : '.......',
            'dateNow' => $transfer->DecisionDate ? $transfer->DecisionDate->format('d') : '.......',
            'monthNow' => $transfer->DecisionDate ? $transfer->DecisionDate->format('m') : '.......',
            'yearNow' => $transfer->DecisionDate ? $transfer->DecisionDate->format('Y') : '.......',
            'decisionDate' => $transfer->DecisionDate ? $transfer->DecisionDate->format('d/m/Y') : '.......',
            'timeApply' => $transfer->TimeApply ? $transfer->TimeApply->format('d/m/Y') : '.......',
            'fullName' => $employee->FullName ? $employee->FullName : '       ',
            'branchWord' => $detail->branch ? $detail->branch->Name : '       ',
        ];

        return $this->wordExporterServices->exportWord('transfer', $params);
    }

    public function delete($id)
    {
        $transfer = Transfer::findOrFail($id);

        $transfer->transferDetails()->delete();

        $transfer->delete();

        return true;
    }
}
