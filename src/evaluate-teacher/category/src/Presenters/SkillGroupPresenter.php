<?php

namespace GGPHP\EvaluateTeacher\Category\Presenters;

use GGPHP\EvaluateTeacher\Category\Transformers\SkillGroupTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class PositionLevelPresenter.
 *
 * @package namespace App\Presenters;
 */
class SkillGroupPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'SkillGroup';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'SkillGroup';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new SkillGroupTransformer();
    }
}
