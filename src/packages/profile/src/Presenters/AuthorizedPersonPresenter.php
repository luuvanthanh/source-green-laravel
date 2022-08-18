<?php

namespace GGPHP\Profile\Presenters;

use GGPHP\Profile\Transformers\AuthorizedPersonTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class AuthorizedPersonPresenter.
 *
 * @package namespace GGPHP\Profile\Presenters;
 */
class AuthorizedPersonPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'AuthorizedPerson';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'AuthorizedPerson';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new AuthorizedPersonTransformer();
    }
}
