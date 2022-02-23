<?php

namespace GGPHP\Crm\Facebook\Presenters;

use GGPHP\Crm\Facebook\Transformers\PageTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class PagePresenter.
 *
 * @package namespace App\Presenters;
 */
class PagePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Page';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Page';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new PageTransformer();
    }
}
