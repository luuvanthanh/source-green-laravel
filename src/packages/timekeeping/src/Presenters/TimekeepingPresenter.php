<?php

namespace GGPHP\Timekeeping\Presenters;

use GGPHP\Timekeeping\Transformers\TimekeepingTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class UserPresenter.
 *
 * @package namespace App\Presenters;
 */
class TimekeepingPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Timekeeping';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Timekeeping';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TimekeepingTransformer();
    }
}
