<?php

namespace GGPHP\RevokeShift\Presenters;

use GGPHP\RevokeShift\Transformers\RevokeShiftTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class RevokeShiftPresenter.
 *
 * @package namespace App\Presenters;
 */
class RevokeShiftPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'RevokeShift';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'RevokeShift';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new RevokeShiftTransformer();
    }
}
