<?php

namespace GGPHP\Salary\Presenters;

use GGPHP\Salary\Transformers\PayrollTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class PayrollPresenter.
 *
 * @package namespace App\Presenters;
 */
class PayrollPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Payroll';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Payroll';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new PayrollTransformer();
    }
}
