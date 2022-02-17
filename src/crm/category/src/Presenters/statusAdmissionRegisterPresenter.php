<?php

namespace GGPHP\Crm\Category\Presenters;

use GGPHP\Crm\Category\Transformers\StatusAdmissionRegisterTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class statusAdmissionRegisterPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'StatusAdmissionRegister';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'StatusAdmissionRegister';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new StatusAdmissionRegisterTransformer();
    }
}
