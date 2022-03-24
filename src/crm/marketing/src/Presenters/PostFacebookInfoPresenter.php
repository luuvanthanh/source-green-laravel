<?php

namespace GGPHP\Crm\Marketing\Presenters;

use GGPHP\Crm\Marketing\Transformers\PostFacebookInfoTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class PostFacebookInfoPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'PostFacebookInfo';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'PostFacebookInfo';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new PostFacebookInfoTransformer();
    }
}
