<?php

namespace GGPHP\TrainingTeacher\Category\Presenters;

use GGPHP\TrainingTeacher\Category\Transformers\TrainingSkillTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class TypeTeacherPresenter.
 *
 * @package namespace App\Presenters;
 */
class TrainingSkillPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'TrainingSkill';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'TrainingSkill';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TrainingSkillTransformer();
    }
}
