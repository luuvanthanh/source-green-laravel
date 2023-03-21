<?php

namespace GGPHP\Recruitment\Presenters;

use GGPHP\Recruitment\Transformers\RecruitmentCandidateManagementTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class LevelPresenter.
 *
 * @package namespace App\Presenters;
 */
class RecruitmentCandidateManagementPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Candidate';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Candidate';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new RecruitmentCandidateManagementTransformer();
    }
}
