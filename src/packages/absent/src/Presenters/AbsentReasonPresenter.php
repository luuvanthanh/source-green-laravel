<?php

namespace GGPHP\Absent\Presenters;

use GGPHP\Absent\Transformers\AbsentReasonTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class UserPresenter.
 *
 * @package namespace App\Presenters;
 */
class AbsentReasonPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'AbsentReason';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'AbsentReason';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new AbsentReasonTransformer();
    }
}
