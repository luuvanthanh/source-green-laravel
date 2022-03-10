<?php

namespace GGPHP\EvaluateTeacher\Category\Presenters;

use GGPHP\EvaluateTeacher\Category\Transformers\RatingLevelTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class PositionLevelPresenter.
 *
 * @package namespace App\Presenters;
 */
class RatingLevelPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'RatingLevel';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'RatingLevel';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new RatingLevelTransformer();
    }
}
