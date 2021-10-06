<?php

namespace GGPHP\Crm\Marketing\Presenters;

use GGPHP\Crm\Marketing\Transformers\MarketingProgramTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class MarketingProgramPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'MarketingProgram';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'MarketingProgram';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new MarketingProgramTransformer();
    }
}
