<?php

namespace GGPHP\Recruitment\Presenters;

use GGPHP\Recruitment\Transformers\RecruitmentConfigurationTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class LevelPresenter.
 *
 * @package namespace App\Presenters;
 */
class RecruitmentConfigurationPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'RecruitmentConfiguration';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'RecruitmentConfiguration';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new RecruitmentConfigurationTransformer();
    }
}
