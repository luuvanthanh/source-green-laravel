<?php

namespace GGPHP\Crm\Marketing\Presenters;

use GGPHP\Crm\Marketing\Transformers\ArticleTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class ArticlePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Article';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Article';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ArticleTransformer();
    }
}
