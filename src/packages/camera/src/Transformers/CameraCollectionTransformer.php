<?php

namespace GGPHP\Camera\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Camera\Models\CameraCollection;
use GGPHP\Collection\Transformers\CollectionTransformer;
use GGPHP\Camera\Transformers\CameraTransformer;

/**
 * Class CollectionTransformer.
 *
 * @package namespace App\Transformers;
 */
class CameraCollectionTransformer extends BaseTransformer
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
    protected $availableIncludes = ['collection', 'camera'];

    /**
     * Load collection
     *
     * @param UserCollection $item
     * @return type
     */
    public function includeCollection(CameraCollection $item) {
        if (empty($item->collection)) {
            return;
        }
        return $this->item($item->collection, new CollectionTransformer(), 'Collection');
    }

    /**
     * Load collection
     *
     * @param UserCollection $item
     * @return type
     */
    public function includeCamera(CameraCollection $item) {
        if (empty($item->camera)) {
            return;
        }
        return $this->item($item->camera, new CameraTransformer(), 'Camera');
    }
}
