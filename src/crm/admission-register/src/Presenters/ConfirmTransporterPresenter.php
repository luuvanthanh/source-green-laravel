<?php

namespace GGPHP\Crm\AdmissionRegister\Presenters;

use GGPHP\Crm\AdmissionRegister\Transformers\ConfirmTransporterTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CustomerPotentialEventInfoPresenter.
 *
 * @package namespace App\Presenters;
 */
class ConfirmTransporterPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ConfirmTransporter';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ConfirmTransporter';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ConfirmTransporterTransformer();
    }
}
