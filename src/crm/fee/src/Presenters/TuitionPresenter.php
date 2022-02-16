<?php

namespace GGPHP\Crm\Fee\Presenters;

use GGPHP\Crm\Fee\Transformers\TuitionTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CityPresenter.
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
