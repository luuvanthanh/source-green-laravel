<?php

namespace GGPHP\Clover\Presenters;

use GGPHP\Clover\Transformers\StudentTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class StudentPresenter.
 *
 * @package namespace App\Presenters;
 */
class StudentPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Student';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Student';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new StudentTransformer();
    }
}
