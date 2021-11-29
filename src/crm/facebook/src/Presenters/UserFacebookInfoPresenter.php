<?php

namespace GGPHP\Crm\Facebook\Presenters;

use GGPHP\Crm\Facebook\Transformers\UserFacebookInfoTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class UserFacebookInfoPresenter.
 *
 * @package namespace App\Presenters;
 */
class UserFacebookInfoPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'UserFacebookInfo';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'UserFacebookInfo';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new UserFacebookInfoTransformer();
    }
}
