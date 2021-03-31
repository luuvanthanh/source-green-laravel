<?php

namespace GGPHP\ShiftSchedule\Presenters;

use GGPHP\ShiftSchedule\Transformers\ShiftDetailTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ShiftDetailPresenter.
 *
 * @package namespace GGPHP\ShiftSchedule\Presenters;
 */
class ShiftDetailPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ShiftDetail';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ShiftDetail';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ShiftDetailTransformer();
    }
}
