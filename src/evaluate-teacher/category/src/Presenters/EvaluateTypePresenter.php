<?php

namespace GGPHP\EvaluateTeacher\Category\Presenters;

use GGPHP\EvaluateTeacher\Category\Transformers\EvaluateTypeTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class PositionLevelPresenter.
 *
 * @package namespace App\Presenters;
 */
class EvaluateTypePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'EvaluateType';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'EvaluateType';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new EvaluateTypeTransformer();
    }
}
