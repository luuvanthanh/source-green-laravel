<?php

namespace GGPHP\Crm\AdmissionRegister\Presenters;

use GGPHP\Crm\AdmissionRegister\Transformers\AdmissionRegisterTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CustomerPotentialEventInfoPresenter.
 *
 * @package namespace App\Presenters;
 */
class AdmissionRegisterPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'AdmissionRegister';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'AdmissionRegister';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new AdmissionRegisterTransformer();
    }
}
