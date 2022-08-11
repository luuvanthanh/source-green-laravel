<?php

namespace GGPHP\VideoWall\Presenters;

use GGPHP\VideoWall\Transformers\VideoWallTransformer;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use League\Fractal\Resource\Collection;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class VideoWallPresenter.
 *
 * @package namespace App\Presenters;
 */
class VideoWallPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'VideoWall';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'VideoWall';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new VideoWallTransformer();
    }

    /**
     * @param AbstractPaginator|LengthAwarePaginator|Paginator $paginator
     *
     * @return \League\Fractal\Resource\Collection
     */
    public function transformPaginator($paginator)
    {
        $collection = $paginator->getCollection();
        $resource = new Collection($collection, $this->getTransformer(), $this->resourceKeyCollection);
        $resource->setPaginator(new IlluminatePaginatorAdapter($paginator));
        return $resource;
    }
}
