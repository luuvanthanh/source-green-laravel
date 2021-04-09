<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\BranchTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class BranchPresenter.
 *
 * @package namespace App\Presenters;
 */
class BranchPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'Branch';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'Branch';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new BranchTransformer();
    }
}
