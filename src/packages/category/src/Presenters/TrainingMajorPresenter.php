<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\TrainingMajorTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class TrainingMajorPresenter.
 *
 * @package namespace App\Presenters;
 */
class TrainingMajorPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'TrainingMajor';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'TrainingMajor';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TrainingMajorTransformer();
    }
}
