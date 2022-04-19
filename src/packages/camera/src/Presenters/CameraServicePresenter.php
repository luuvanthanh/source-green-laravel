<?php

namespace GGPHP\Camera\Presenters;

use GGPHP\Camera\Transformers\CameraServiceTransformer;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use League\Fractal\Resource\Collection;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CameraServicePresenter.
 *
 * @package namespace App\Presenters;
 */
class CameraServicePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'CameraService';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'CameraService';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CameraServiceTransformer();
    }
}
