<?php

namespace GGPHP\Crm\AdmissionRegister\Presenters;

use GGPHP\Crm\AdmissionRegister\Transformers\ChildEvaluateInfoTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CustomerPotentialEventInfoPresenter.
 *
 * @package namespace App\Presenters;
 */
class ChildEvaluateInfoPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ChildEvaluateInfo';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ChildEvaluateInfo';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ChildEvaluateInfoTransformer();
    }
}
