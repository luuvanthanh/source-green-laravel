<?php

namespace GGPHP\Crm\Employee\Presenters;

use GGPHP\Crm\Employee\Transformers\EmployeeTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CustomerPotentialEventInfoPresenter.
 *
 * @package namespace App\Presenters;
 */
class EmployeePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Employee';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Employee';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new EmployeeTransformer();
    }
}
