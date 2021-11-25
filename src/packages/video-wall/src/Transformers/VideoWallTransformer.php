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
    protected $availableIncludes = ['user', 'cameras'];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * Load user
     *
     * @param VideoWall $item
     * @return type
     */
    public function includeUser(VideoWall $item) {
        if (empty($item->user)) {
            return;
        }

        return $this->item($item->user, new UserTransformer(), 'User');
    }

    /**
     * Load cameras
     *
     * @param VideoWall $item
     * @return type
     */
    public function includeCameras(VideoWall $videoWall) {
        if (empty($videoWall->cameras)) {
            return;
        }

        return $this->collection($videoWall->cameras, new CameraTransformer, 'Camera');
    }
}
