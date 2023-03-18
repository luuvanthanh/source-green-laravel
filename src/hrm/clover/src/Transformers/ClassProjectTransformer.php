<?php

namespace GGPHP\Clover\Transformers;

use GGPHP\Clover\Models\Classes;
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
        'project'
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
        $projects = $this->getProject($model);

        return [
            "projects" => !is_null($projects) ? $projects : []
        ];
    }

    public function getProject($model)
    {
        $projects = ClassProject::where('ItemId', $model->Id)->where('Type', 'PROJECT')->get();

        return $projects;
    }

    // /**
    //  * Include teacher
    //  * @param Classes $classes
    //  * @return \League\Fractal\Resource\Collection
    //  */
    // public function includeStudent(Classes $classes)
    // {
    //     return $this->collection($classes->student, new StudentTransformer, 'Student');
    // }
}
