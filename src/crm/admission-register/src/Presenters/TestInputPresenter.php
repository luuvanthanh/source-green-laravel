<?php

namespace GGPHP\Crm\AdmissionRegister\Presenters;

use GGPHP\Crm\AdmissionRegister\Transformers\TestInputTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CustomerPotentialEventInfoPresenter.
 *
 * @package namespace App\Presenters;
 */
class TestInputPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'TestInput';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'TestInput';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TestInputTransformer();
    }
}
