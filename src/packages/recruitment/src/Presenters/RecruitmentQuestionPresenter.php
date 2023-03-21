<?php

namespace GGPHP\Recruitment\Presenters;

use GGPHP\Recruitment\Transformers\RecruitmentQuestionTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class LevelPresenter.
 *
 * @package namespace App\Presenters;
 */
class RecruitmentQuestionPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Question';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Question';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new RecruitmentQuestionTransformer();
    }
}
