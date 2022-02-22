<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\EducationalLevelTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class EducationalLevelPresenter.
 *
 * @package namespace App\Presenters;
 */
class EducationalLevelPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'EducationalLevel';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'EducationalLevel';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new EducationalLevelTransformer();
    }
}
