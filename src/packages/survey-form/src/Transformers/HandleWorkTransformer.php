<?php

namespace GGPHP\SurveyForm\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class HandleWorkTransformer.
 *
 * @package namespace App\Transformers;
 */
class HandleWorkTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * Transform the HandleWork entity.
     *
     * @param HandleWork $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $files = null;
        $media = $model->getMedia('files');

        if (!empty(count($media))) {
            foreach ($media as $value) {
                $files[] = [
                    'path' => $value->getPath(),
                    'file_name' => $value->name,
                ];
            }
        }

        return [
            'files' => $files,
        ];
    }
}
