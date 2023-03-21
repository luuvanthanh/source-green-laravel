<?php

namespace GGPHP\Recruitment\Presenters;

use GGPHP\Recruitment\Transformers\RecruitmentManagerTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class LevelPresenter.
 *
 * @package namespace App\Presenters;
 */
class RecruitmentManagerPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'RecruitmentManager';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'RecruitmentManager';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new RecruitmentManagerTransformer();
    }
}
