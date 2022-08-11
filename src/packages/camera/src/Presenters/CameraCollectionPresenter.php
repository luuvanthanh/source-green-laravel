<?php

namespace GGPHP\Camera\Presenters;

use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use League\Fractal\Resource\Collection;
use Prettus\Repository\Presenter\FractalPresenter;
use GGPHP\Camera\Transformers\CameraCollectionTransformer;

/**
 * Class CameraCollectionPresenter.
 *
 * @package namespace App\Presenters;
 */
class CameraCollectionPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'CameraCollection';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'CameraCollection';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CameraCollectionTransformer();
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
