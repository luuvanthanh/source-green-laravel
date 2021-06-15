<?php

namespace GGPHP\Fee\Presenters;

use GGPHP\Fee\Transformers\StudentObjectTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class StudentObjectPresenter.
 *
 * @package namespace App\Presenters;
 */
class StudentObjectPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'StudentObject';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'StudentObject';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new StudentObjectTransformer();
    }
}
