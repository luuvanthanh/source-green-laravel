<?php

namespace GGPHP\Users\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Models\UserCollection;
use GGPHP\Collection\Transformers\CollectionTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class CollectionTransformer.
 *
 * @package namespace App\Transformers;
 */
class UserCollectionTransformer extends BaseTransformer
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
    protected $availableIncludes = ['collection', 'user'];

    /**
     * Load collection
     *
     * @param UserCollection $item
     * @return type
     */
    public function includeCollection(UserCollection $item) {
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
    public function includeUser(UserCollection $item) {
        if (empty($item->user)) {
            return;
        }
        return $this->item($item->user, new UserTransformer(), 'User');
    }
}
