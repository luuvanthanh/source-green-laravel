<?php

namespace GGPHP\Profile\Presenters;

use GGPHP\Profile\Transformers\SabbaticalLeaveTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class UserPresenter.
 *
 * @package namespace App\Presenters;
 */
class SabbaticalLeavePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'SabbaticalLeave';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'SabbaticalLeave';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new SabbaticalLeaveTransformer();
    }
}
