<?php

namespace GGPHP\TrainingTeacher\Category\Presenters;

use GGPHP\TrainingTeacher\Category\Transformers\TrainingModuleTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class TypeTeacherPresenter.
 *
 * @package namespace App\Presenters;
 */
class TrainingModulePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'TrainingModule';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'TrainingModule';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TrainingModuleTransformer();
    }
}
