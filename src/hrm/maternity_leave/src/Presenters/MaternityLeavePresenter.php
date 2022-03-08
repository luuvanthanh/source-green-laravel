<?php

namespace GGPHP\MaternityLeave\Presenters;

use GGPHP\MaternityLeave\Transformers\MaternityLeaveTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class MaternityLeavePresenter.
 *
 * @package namespace App\Presenters;
 */
class MaternityLeavePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'MaternityLeave';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'MaternityLeave';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new MaternityLeaveTransformer();
    }
}
