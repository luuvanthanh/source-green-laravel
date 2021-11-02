<?php

namespace GGPHP\Crm\Category\Presenters;

use GGPHP\Crm\Category\Transformers\BranchTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class BranchPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Branch';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Branch';
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
