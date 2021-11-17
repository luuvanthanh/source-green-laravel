<?php

namespace GGPHP\Users\Presenters;

use GGPHP\Users\Transformers\UserTransformer;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use League\Fractal\Resource\Collection;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class UserPresenter.
 *
 * @package namespace App\Presenters;
 */
class UserPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'User';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'User';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new UserTransformer();
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
