<?php

namespace GGPHP\WorkHour\Presenters;

use GGPHP\WorkHour\Transformers\WorkHourTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class WorkHourPresenter.
 *
 * @package namespace App\Presenters;
 */
class WorkHourPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'WorkHour';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'WorkHour';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new WorkHourTransformer();
    }
}
