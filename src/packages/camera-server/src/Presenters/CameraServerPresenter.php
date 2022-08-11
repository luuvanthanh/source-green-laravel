<?php

namespace GGPHP\CameraServer\Presenters;

use GGPHP\CameraServer\Transformers\CameraServerTransformer;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use League\Fractal\Resource\Collection;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CollectionPresenter.
 *
 * @package namespace App\Presenters;
 */
class CameraServerPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'CameraServer';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'CameraServer';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CameraServerTransformer();
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
