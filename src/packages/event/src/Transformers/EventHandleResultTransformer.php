<?php

namespace GGPHP\Event\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Event\Models\EventHandleResult;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class EventHandleResultTransformer.
 *
 * @package namespace GGPHP\Event\Transformers;
 */
class EventHandleResultTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['userHandle'];

    /**
     * Transform the custom field entity.
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

    /**
     * Include EventAdditionalInformation
     * @param EventHandleResult $fault
     */
    public function includeUserEdit(EventHandleResult $model)
    {
        if (is_null($model->userHandle)) {
            return;
        }

        return $this->item($model->userHandle, new UserTransformer, 'UserHandle');
    }
}
