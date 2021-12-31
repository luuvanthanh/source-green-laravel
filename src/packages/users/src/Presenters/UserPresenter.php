<?php

namespace GGPHP\Users\Presenters;

use GGPHP\Users\Transformers\UserTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class UserPresenter.
 *
 * @package namespace App\Presenters;
 */
class UserPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Employee';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Employee';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new UserTransformer();
    }
}
