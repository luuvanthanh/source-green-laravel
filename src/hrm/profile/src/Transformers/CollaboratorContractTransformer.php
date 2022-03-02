<?php

namespace GGPHP\Profile\Transformers;

use GGPHP\Category\Transformers\BranchTransformer;
use GGPHP\Category\Transformers\DivisionTransformer;
use GGPHP\Category\Transformers\PositionTransformer;
use GGPHP\Category\Transformers\TypeOfContractTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Profile\Models\CollaboratorContract;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class CollaboratorContractTransformer.
 *
 * @package namespace App\Transformers;
 */
class CollaboratorContractTransformer extends BaseTransformer
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
            'parameterValues' => $parameterValues,
        ];
    }

    /**
     * @param CollaboratorContract $collaboratorContract
     * @return mixed
     */
    public function includeEmployee(CollaboratorContract $collaboratorContract)
    {
        if (empty($collaboratorContract->employee)) {
            return;
        }

        return $this->item($collaboratorContract->employee, new UserTransformer, 'Employee');
    }

    /**
     * @param CollaboratorContract $collaboratorContract
     * @return mixed
     */
    public function includeTypeOfContract(CollaboratorContract $collaboratorContract)
    {
        if (empty($collaboratorContract->typeOfContract)) {
            return;
        }

        return $this->item($collaboratorContract->typeOfContract, new TypeOfContractTransformer, 'TypeOfContract');
    }

    /**
     * @param CollaboratorContract $collaboratorContract
     * @return mixed
     */
    public function includeDivision(CollaboratorContract $collaboratorContract)
    {
        if (empty($collaboratorContract->division)) {
            return;
        }

        return $this->item($collaboratorContract->division, new DivisionTransformer, 'Division');
    }

    /**
     * @param CollaboratorContract $collaboratorContract
     * @return mixed
     */
    public function includePosition(CollaboratorContract $collaboratorContract)
    {
        if (empty($collaboratorContract->position)) {
            return;
        }

        return $this->item($collaboratorContract->position, new PositionTransformer, 'Position');
    }

    /**
     * @param CollaboratorContract $collaboratorContract
     * @return mixed
     */
    public function includeBranch(CollaboratorContract $collaboratorContract)
    {
        if (empty($collaboratorContract->branch)) {
            return;
        }

        return $this->item($collaboratorContract->branch, new BranchTransformer, 'Branch');
    }
}
