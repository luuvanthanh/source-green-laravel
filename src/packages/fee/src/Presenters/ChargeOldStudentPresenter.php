<?php

namespace GGPHP\Fee\Presenters;

use GGPHP\Fee\Transformers\ChargeOldStudentTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ChargeOldStudentPresenter.
 *
 * @package namespace App\Presenters;
 */
class ChargeOldStudentPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ChargeOldStudent';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ChargeOldStudent';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ChargeOldStudentTransformer();
    }
}
