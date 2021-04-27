<?php

namespace GGPHP\Clover\Presenters;

use GGPHP\Clover\Transformers\ParentsTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ParentsPresenter.
 *
 * @package namespace App\Presenters;
 */
class ParentsPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Parent';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Parent';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ParentsTransformer();
    }

}
