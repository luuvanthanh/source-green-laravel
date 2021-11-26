<?php

namespace GGPHP\Camera\Presenters;

use GGPHP\Camera\Transformers\CameraTransformer;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use League\Fractal\Resource\Collection;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CameraPresenter.
 *
 * @package namespace App\Presenters;
 */
class CameraPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'Camera';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'Camera';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CameraTransformer();
    }

    /**
     * @param $data
     *
     * @return \League\Fractal\Resource\Collection
     */
    public function transformCollection($data)
    {
        $resource = new Collection($data, $this->getTransformer(), $this->resourceKeyCollection);
        return $resource;
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
