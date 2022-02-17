<?php

namespace GGPHP\Crm\AdmissionRegister\Presenters;

use GGPHP\Crm\AdmissionRegister\Transformers\ProfileInfoTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CustomerPotentialEventInfoPresenter.
 *
 * @package namespace App\Presenters;
 */
class ProfileInfoPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ProfileInfo';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ProfileInfo';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ProfileInfoTransformer();
    }
}
