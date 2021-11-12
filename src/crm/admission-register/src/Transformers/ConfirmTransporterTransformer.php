<?php

namespace GGPHP\Crm\AdmissionRegister\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\AdmissionRegister\Models\ConfirmTransporter;
use GGPHP\Crm\Category\Transformers\CategoryRelationshipTransformer;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class ConfirmTransporterTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['categoryRelationship'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param  

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeCategoryRelationship(ConfirmTransporter $confirmTransporter)
    {
        if (empty($confirmTransporter->categoryRelationship)) {
            return;
        }

        return $this->item($confirmTransporter->categoryRelationship, new CategoryRelationshipTransformer, 'CategoryRelationship');
    }
}
