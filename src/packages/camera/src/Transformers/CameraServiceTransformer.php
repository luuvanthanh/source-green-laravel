<?php

namespace GGPHP\Camera\Transformers;

use GGPHP\AiService\Transformers\AiServiceTransformer;
use GGPHP\Camera\Models\CameraService;
use GGPHP\Camera\Transformers\CameraTransformer;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class CameraServiceTransformer.
 *
 * @package namespace App\Transformers;
 */
class CameraServiceTransformer extends BaseTransformer
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
    protected $availableIncludes = ['camera', 'aiService'];

    public function customAttributes($model): array
    {
        $urlStream = null;

        if ($model->is_stream) {
            $urlStream = env('MEDIA_URL') . '/live' . '/' . $model->camera_id . '_' . $model->aiService->const_stream . '.flv';
        }

        return [
            'url_stream' => $urlStream
        ];
    }

    /**
     * Load collection
     *
     * @param UserCollection $item
     * @return type
     */
    public function includeCamera(CameraService $item)
    {
        if (empty($item->camera)) {
            return;
        }
        return $this->item($item->camera, new CameraTransformer, 'Camera');
    }

    /**
     * Load collection
     *
     * @param UserCollection $item
     * @return type
     */
    public function includeAiService(CameraService $item)
    {
        if (empty($item->aiService)) {
            return;
        }
        return $this->item($item->aiService, new AiServiceTransformer, 'AiService');
    }
}
