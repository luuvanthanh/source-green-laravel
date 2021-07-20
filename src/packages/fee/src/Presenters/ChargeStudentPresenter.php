<?php

namespace GGPHP\Fee\Presenters;

use GGPHP\Fee\Transformers\ChargeStudentTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ChargeStudentPresenter.
 *
 * @package namespace App\Presenters;
 */
class ChargeStudentPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ChargeStudent';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ChargeStudent';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ChargeStudentTransformer();
    }
}
