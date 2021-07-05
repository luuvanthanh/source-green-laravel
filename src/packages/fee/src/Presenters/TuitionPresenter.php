<?php

namespace GGPHP\Fee\Presenters;

use GGPHP\Fee\Transformers\TuitionTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class TuitionPresenter.
 *
 * @package namespace App\Presenters;
 */
class TuitionPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Tuition';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Tuition';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TuitionTransformer();
    }
}
