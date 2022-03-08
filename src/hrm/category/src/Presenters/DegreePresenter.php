<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\DegreeTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class DegreePresenter.
 *
 * @package namespace App\Presenters;
 */
class DegreePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Degree';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Degree';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new DegreeTransformer();
    }
}
