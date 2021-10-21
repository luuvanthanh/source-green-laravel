<?php

namespace GGPHP\Profile\Presenters;

use GGPHP\Profile\Transformers\HealthInsuranceTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class InsurrancePresenter.
 *
 * @package namespace GGPHP\Profile\Presenters;
 */
class HealthInsurancePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'HealthInsurrance';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'HealthInsurrance';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new HealthInsuranceTransformer();
    }
}
