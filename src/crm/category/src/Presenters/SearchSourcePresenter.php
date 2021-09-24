<?php

namespace GGPHP\Crm\Category\Presenters;

use GGPHP\Crm\Category\Transformers\SearchSourceTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class SearchSourcePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'SearchSource';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'SearchSource';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new SearchSourceTransformer();
    }
}
