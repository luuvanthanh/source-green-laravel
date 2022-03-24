<?php

namespace GGPHP\Crm\Marketing\Presenters;

use GGPHP\Crm\Marketing\Transformers\ArticleReactionInfoTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class ArticleReactionInfoPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ArticleReactionInfo';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ArticleReactionInfo';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ArticleReactionInfoTransformer();
    }
}
