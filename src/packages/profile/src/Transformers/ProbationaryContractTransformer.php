<?php

namespace GGPHP\Profile\Transformers;

use GGPHP\Category\Transformers\BranchTransformer;
use GGPHP\Category\Transformers\DivisionTransformer;
use GGPHP\Category\Transformers\PositionTransformer;
use GGPHP\Category\Transformers\TypeOfContractTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Profile\Models\ProbationaryContract;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class ProbationaryContractTransformer.
 *
 * @package namespace App\Transformers;
 */
class ProbationaryContractTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['employee', 'typeOfContract', 'division', 'position', 'branch'];

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
            "parameterValues" => $parameterValues,
        ];
    }

    /**
     * @param ProbationaryContract $probationaryContract
     * @return mixed
     */
    public function includeEmployee(ProbationaryContract $probationaryContract)
    {
        if (empty($probationaryContract->employee)) {
            return;
        }

        return $this->item($probationaryContract->employee, new UserTransformer, 'Employee');
    }

    /**
     * @param ProbationaryContract $probationaryContract
     * @return mixed
     */
    public function includeTypeOfContract(ProbationaryContract $probationaryContract)
    {
        if (empty($probationaryContract->typeOfContract)) {
            return;
        }

        return $this->item($probationaryContract->typeOfContract, new TypeOfContractTransformer, 'TypeOfContract');
    }

    /**
     * @param ProbationaryContract $probationaryContract
     * @return mixed
     */
    public function includeDivision(ProbationaryContract $probationaryContract)
    {
        if (empty($probationaryContract->division)) {
            return;
        }

        return $this->item($probationaryContract->division, new DivisionTransformer, 'Division');
    }

    /**
     * @param ProbationaryContract $probationaryContract
     * @return mixed
     */
    public function includePosition(ProbationaryContract $probationaryContract)
    {
        if (empty($probationaryContract->position)) {
            return;
        }

        return $this->item($probationaryContract->position, new PositionTransformer, 'Position');
    }

    /**
     * @param ProbationaryContract $probationaryContract
     * @return mixed
     */
    public function includeBranch(ProbationaryContract $probationaryContract)
    {
        if (empty($probationaryContract->branch)) {
            return;
        }

        return $this->item($probationaryContract->branch, new BranchTransformer, 'Branch');
    }

}
