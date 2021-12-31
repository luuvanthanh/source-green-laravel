<?php

namespace GGPHP\DocumentManagement\Transformers;

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
    protected $defaultIncludes = ['employee'];
    protected $availableIncludes = [];

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
}
