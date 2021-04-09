<?php

namespace GGPHP\Profile\Transformers;

use GGPHP\Category\Transformers\BranchTransformer;
use GGPHP\Category\Transformers\DivisionTransformer;
use GGPHP\Category\Transformers\PositionTransformer;
use GGPHP\Category\Transformers\TypeOfContractTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Users\Transformers\UserTransformer;

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
    protected $availableIncludes = ['employee', 'typeOfContract', 'division', 'position', 'branch'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [
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
