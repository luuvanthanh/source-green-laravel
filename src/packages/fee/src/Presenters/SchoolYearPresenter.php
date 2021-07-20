<?php

namespace GGPHP\Fee\Presenters;

use GGPHP\Fee\Transformers\SchoolYearTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class SchoolYearPresenter.
 *
 * @package namespace App\Presenters;
 */
class SchoolYearPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'SchoolYear';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'SchoolYear';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new SchoolYearTransformer();
    }
}
