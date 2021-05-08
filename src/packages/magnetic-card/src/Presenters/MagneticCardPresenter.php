<?php

namespace GGPHP\MagneticCard\Presenters;

use GGPHP\MagneticCard\Transformers\MagneticCardTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class MagneticCardPresenter.
 *
 * @package namespace App\Presenters;
 */
class MagneticCardPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'MagneticCard';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'MagneticCard';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new MagneticCardTransformer();
    }
}
