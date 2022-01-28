<?php

namespace GGPHP\Crm\Fee\Presenters;

use GGPHP\Crm\Fee\Transformers\SchoolYearTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CityPresenter.
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
