<?php

namespace GGPHP\Category\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class CardTypeTransformer.
 *
 * @package namespace GGPHP\Category\Transformers;
 */
class CardTypeTransformer extends BaseTransformer
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
    protected $availableIncludes = [];

    /**
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $previousFile = null;

        if (!is_null($model->getPreviousFile())) {
            $previousFile = [
                'path' => $model->getPreviousFile()->getPath(),
                'name' => $model->getPreviousFile()->name,
            ];
        }

        $afterFile = null;

        if (!is_null($model->getAfterFile())) {
            $afterFile = [
                'path' => $model->getAfterFile()->getPath(),
                'name' => $model->getAfterFile()->name,
            ];
        }

        return [
            'previous_file' => $previousFile,
            'after_file' => $afterFile
        ];
    }
}
