<?php

namespace GGPHP\Crm\Facebook\Presenters;

use GGPHP\Crm\Facebook\Transformers\UserFacebookInfoTagTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class UserFacebookInfoPresenter.
 *
 * @package namespace App\Presenters;
 */
class UserFacebookInfoTagPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'UserFacebookInfoTag';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'UserFacebookInfoTag';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new UserFacebookInfoTagTransformer();
    }
}
