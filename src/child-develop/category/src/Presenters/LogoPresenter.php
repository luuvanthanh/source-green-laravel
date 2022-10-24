<?php

namespace GGPHP\ChildDevelop\Category\Presenters;

use GGPHP\ChildDevelop\Category\Transformers\LogoTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class LogoPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Logo';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Logo';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new LogoTransformer();
    }
}
