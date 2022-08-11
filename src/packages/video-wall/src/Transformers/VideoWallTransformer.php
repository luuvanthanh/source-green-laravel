<?php

namespace GGPHP\VideoWall\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\VideoWall\Models\VideoWall;
use GGPHP\Users\Transformers\UserTransformer;
use GGPHP\Camera\Transformers\CameraTransformer;

/**
 * Class CollectionTransformer.
 *
 * @package namespace App\Transformers;
 */
class VideoWallTransformer extends BaseTransformer
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
    protected $availableIncludes = ['user', 'camera'];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    /**
     * Load user
     *
     * @param VideoWall $item
     * @return type
     */
    public function includeUser(VideoWall $item)
    {
        if (is_null($item->user)) {
            return;
        }

        return $this->item($item->user, new UserTransformer, 'User');
    }

    /**
     * Load cameras
     *
     * @param VideoWall $item
     * @return type
     */
    public function includeCamera(VideoWall $videoWall)
    {
        return $this->collection($videoWall->cameras, new CameraTransformer, 'Camera');
    }
}
