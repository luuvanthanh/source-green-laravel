<?php

namespace GGPHP\DocumentManagement\Transformers;

use GGPHP\Category\Transformers\BranchTransformer;
use GGPHP\Category\Transformers\DivisionTransformer;
use GGPHP\DocumentManagement\Models\DocumentManagement;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class DocumentManagementTransformer.
 *
 * @package namespace GGPHP\DocumentManagement\Transformers;
 */
class DocumentManagementTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];
    protected $availableIncludes = ['employee', 'employeeSender', 'branch', 'sentDivision', 'receiveDivision'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $typeOfDocument = null;
        $topic = null;

        foreach (DocumentManagement::TYPE_DOCUMENT as $key => $value) {

            if ($model->TypeOfDocument == $value) {
                $typeOfDocument = $key;
            }
        }

        foreach (DocumentManagement::TOPIC as $key => $value) {

            if ($model->Topic == $value) {
                $topic = $key;
            }
        }

        return [
            'TypeOfDocument' => $typeOfDocument,
            'Topic' => $topic
        ];
    }

    public function includeEmployee(DocumentManagement $documentManagement)
    {
        return $this->collection($documentManagement->employee, new UserTransformer, 'Employee');
    }

    public function includeEmployeeSender(DocumentManagement $documentManagement)
    {
        if (empty($documentManagement->employeeSender)) {
            return;
        }

        return $this->item($documentManagement->employeeSender, new UserTransformer, 'EmployeeSender');
    }

    public function includeBranch(DocumentManagement $documentManagement)
    {
        if (empty($documentManagement->branch)) {
            return;
        }

        return $this->item($documentManagement->branch, new BranchTransformer, 'Branch');
    }

    public function includeSentDivision(DocumentManagement $documentManagement)
    {
        if (empty($documentManagement->sentDivision)) {
            return;
        }

        return $this->item($documentManagement->sentDivision, new DivisionTransformer, 'SentDivision');
    }

    public function includeReceiveDivision(DocumentManagement $documentManagement)
    {
        if (empty($documentManagement->receiveDivision)) {
            return;
        }

        return $this->item($documentManagement->receiveDivision, new DivisionTransformer, 'ReceiveDivision');
    }
}
