<?php

namespace GGPHP\Clover\Transformers;

use GGPHP\Clover\Models\ClassProject;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class ClassProjectTransformer.
 *
 * @package namespace App\Transformers;
 */
class ClassProjectTransformer extends BaseTransformer
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
    protected $availableIncludes = [
        'module', 'program'
    ];

    /**
     * Transform the Classes entity.
     *
     * @param Classes $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {   
        return [];
    }

    public function includeModule(ClassProject $classProject)
    {
        if (empty($classProject->module)) {
            return;
        }

        return $this->item($classProject->module, new ClassProjectTransformer, 'Module');
    }

    public function includeProgram(ClassProject $classProject)
    {
        if (empty($classProject->program)) {
            return;
        }

        return $this->item($classProject->program, new ClassProjectTransformer, 'Program');
    }
}
