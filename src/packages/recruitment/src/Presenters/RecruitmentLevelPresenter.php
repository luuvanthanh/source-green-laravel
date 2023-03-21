<?php

namespace GGPHP\Recruitment\Presenters;

use GGPHP\Recruitment\Transformers\RecruitmentLevelTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class LevelPresenter.
 *
 * @package namespace App\Presenters;
 */
class RecruitmentLevelPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'RecruitmentLevel';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'RecruitmentLevel';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new RecruitmentLevelTransformer();
    }
}
