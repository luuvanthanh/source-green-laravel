<?php

namespace GGPHP\EvaluateTeacher\Category\Presenters;

use GGPHP\EvaluateTeacher\Category\Transformers\EvaluateStepTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class EvaluateStepPresenter.
 *
 * @package namespace App\Presenters;
 */
class EvaluateStepPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'EvaluateStep';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'EvaluateStep';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new EvaluateStepTransformer();
    }
}
