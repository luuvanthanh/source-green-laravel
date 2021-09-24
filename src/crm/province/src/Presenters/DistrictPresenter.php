<?php

namespace GGPHP\Crm\Province\Presenters;

use GGPHP\Crm\Province\Transformers\DistrictTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class DistrictPresenter.
 *
 * @package namespace App\Presenters;
 */
class DistrictPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'District';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'District';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new DistrictTransformer();
    }
}
