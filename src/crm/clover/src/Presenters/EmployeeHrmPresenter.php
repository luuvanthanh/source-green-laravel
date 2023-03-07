<?php

namespace GGPHP\Crm\Clover\Presenters;

use GGPHP\Crm\Clover\Transformers\EmployeeHrmTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class EmployeeHrmPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'EmployeeHrm';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'EmployeeHrm';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new EmployeeHrmTransformer();
    }
}
