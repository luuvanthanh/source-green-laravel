<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\CriteriaTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class BlockPresenter.
 *
 * @package namespace App\Presenters;
 */
class CriteriaPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Criteria';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Criteria';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CriteriaTransformer();
    }
}
