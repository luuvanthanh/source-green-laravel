<?php

namespace GGPHP\Crm\Fee\Presenters;

use GGPHP\Crm\Fee\Transformers\FeePolicieTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CityPresenter.
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
