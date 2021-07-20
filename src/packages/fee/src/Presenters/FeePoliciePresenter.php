<?php

namespace GGPHP\Fee\Presenters;

use GGPHP\Fee\Transformers\FeePolicieTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class FeePoliciePresenter.
 *
 * @package namespace App\Presenters;
 */
class FeePoliciePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'FeePolicie';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'FeePolicie';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new FeePolicieTransformer();
    }
}
