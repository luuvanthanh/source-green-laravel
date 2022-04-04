<?php

namespace GGPHP\Profile\Transformers;

use GGPHP\Category\Transformers\BranchTransformer;
use GGPHP\Category\Transformers\DivisionTransformer;
use GGPHP\Category\Transformers\PositionTransformer;
use GGPHP\Category\Transformers\TypeOfContractTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Users\Transformers\UserTransformer;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Carbon;

/**
 * Class LabourContractTransformer.
 *
 * @package namespace App\Transformers;
 */
class LabourContractTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['employee', 'typeOfContract', 'division', 'position', 'branch', 'represent'];

    /**
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $parameterValues = $model->parameterValues->toArray();

        foreach ($parameterValues as $key => $value) {
            foreach ($value as $keyItem => $item) {
                $newkeyItem = dashesToCamelCase($keyItem, false);

                if ($keyItem != $newkeyItem) {
                    $value[$newkeyItem] = $value[$keyItem];
                    unset($value[$keyItem]);
                }

                if ($keyItem === 'pivot') {
                    foreach ($item as $keyPivot => $itemPivot) {
                        $newkeyPivot = dashesToCamelCase($keyPivot, false);

                        if ($keyPivot != $newkeyPivot) {
                            $item[$newkeyPivot] = $item[$keyPivot];
                            unset($item[$keyPivot]);
                        }
                    }
                    $value[$keyItem] = $item;
                }
            }

            $parameterValues[$key] = $value;
        }
        $numberYearWork = null;
        $numberMonthWork = null;
        $date = request()->date;
        if (!is_null($date)) {
            $date = Carbon::parse($date);
            $quantityWorking = $model->ContractFrom->diff($date);
            $numberMonthWork = $quantityWorking->m;
            $numberYearWork = $quantityWorking->y;
        }

        return [
            'parameterValues' => $parameterValues,
            'numberYearWork' => $numberYearWork,
            'numberMonthWork' => $numberMonthWork,
        ];
    }

    /**
     * @param LabourContract $labourContract
     * @return mixed
     */
    public function includeEmployee(LabourContract $labourContract)
    {
        if (empty($labourContract->employee)) {
            return;
        }

        return $this->item($labourContract->employee, new UserTransformer, 'Employee');
    }

    /**
     * @param LabourContract $labourContract
     * @return mixed
     */
    public function includeRepresent(LabourContract $model)
    {
        if (empty($model->represent)) {
            return;
        }

        return $this->item($model->represent, new UserTransformer, 'Represent');
    }

    /**
     * @param LabourContract $labourContract
     * @return mixed
     */
    public function includeTypeOfContract(LabourContract $labourContract)
    {
        if (empty($labourContract->typeOfContract)) {
            return;
        }

        return $this->item($labourContract->typeOfContract, new TypeOfContractTransformer, 'TypeOfContract');
    }

    /**
     * @param LabourContract $labourContract
     * @return mixed
     */
    public function includeDivision(LabourContract $labourContract)
    {
        if (empty($labourContract->division)) {
            return;
        }

        return $this->item($labourContract->division, new DivisionTransformer, 'Division');
    }

    /**
     * @param LabourContract $labourContract
     * @return mixed
     */
    public function includePosition(LabourContract $labourContract)
    {
        if (empty($labourContract->position)) {
            return;
        }

        return $this->item($labourContract->position, new PositionTransformer, 'Position');
    }

    /**
     * @param LabourContract $labourContract
     * @return mixed
     */
    public function includeBranch(LabourContract $labourContract)
    {
        if (empty($labourContract->branch)) {
            return;
        }

        return $this->item($labourContract->branch, new BranchTransformer, 'Branch');
    }
}
