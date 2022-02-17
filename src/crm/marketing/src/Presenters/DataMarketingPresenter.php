<?php

namespace GGPHP\Crm\Marketing\Presenters;

use GGPHP\Crm\Marketing\Transformers\DataMarketingTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CityPresenter.
 *
 * @package namespace App\Presenters;
 */
class DataMarketingPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'DataMarketing';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'DataMarketing';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new DataMarketingTransformer();
    }
}
