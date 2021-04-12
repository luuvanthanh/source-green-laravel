<?php

namespace GGPHP\SalaryIncrease\Presenters;

use GGPHP\SalaryIncrease\Transformers\SalaryIncreaseTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class SalaryIncreasePresenter.
 *
 * @package namespace App\Presenters;
 */
class SalaryIncreasePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'SalaryIncrease';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'SalaryIncrease';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new SalaryIncreaseTransformer();
    }
}
