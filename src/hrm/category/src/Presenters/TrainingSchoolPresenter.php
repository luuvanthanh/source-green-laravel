<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\TrainingSchoolTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class TrainingSchoolPresenter.
 *
 * @package namespace App\Presenters;
 */
class TrainingSchoolPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'TrainingSchool';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'TrainingSchool';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TrainingSchoolTransformer();
    }
}
