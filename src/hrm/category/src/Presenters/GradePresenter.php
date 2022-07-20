<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\GradeTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class BlockPresenter.
 *
 * @package namespace App\Presenters;
 */
class GradePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Grade';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Grade';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new GradeTransformer();
    }
}
