<?php

namespace GGPHP\Profile\Transformers;

use GGPHP\Category\Transformers\BranchTransformer;
use GGPHP\Category\Transformers\DivisionTransformer;
use GGPHP\Category\Transformers\PositionTransformer;
use GGPHP\Category\Transformers\TypeOfContractTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\SeasonalContract;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class LabourContractTransformer.
 *
 * @package namespace App\Transformers;
 */
class SeasonalContractTransformer extends BaseTransformer
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

        return [
            'parameterValues' => $parameterValues,
        ];
    }

    /**
     * @param LabourContract $labourContract
     * @return mixed
     */
    public function includeRepresent(SeasonalContract $model)
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
    public function includeEmployee(SeasonalContract $seasonalContract)
    {
        if (empty($seasonalContract->employee)) {
            return;
        }

        return $this->item($seasonalContract->employee, new UserTransformer, 'Employee');
    }

    /**
     * @param LabourContract $labourContract
     * @return mixed
     */
    public function includeTypeOfContract(SeasonalContract $seasonalContract)
    {
        if (empty($seasonalContract->typeOfContract)) {
            return;
        }

        return $this->item($seasonalContract->typeOfContract, new TypeOfContractTransformer, 'TypeOfContract');
    }

    /**
     * @param LabourContract $labourContract
     * @return mixed
     */
    public function includeDivision(SeasonalContract $seasonalContract)
    {
        if (empty($seasonalContract->division)) {
            return;
        }

        return $this->item($seasonalContract->division, new DivisionTransformer, 'Division');
    }

    /**
     * @param SeasonalContract $seasonalContract
     * @return mixed
     */
    public function includePosition(SeasonalContract $seasonalContract)
    {
        if (empty($seasonalContract->position)) {
            return;
        }

        return $this->item($seasonalContract->position, new PositionTransformer, 'Position');
    }

    /**
     * @param SeasonalContract $seasonalContract
     * @return mixed
     */
    public function includeBranch(SeasonalContract $seasonalContract)
    {
        if (empty($seasonalContract->branch)) {
            return;
        }

        return $this->item($seasonalContract->branch, new BranchTransformer, 'Branch');
    }
}
