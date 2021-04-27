<?php

namespace GGPHP\ResignationDecision\Presenters;

use GGPHP\ResignationDecision\Transformers\ResignationDecisionTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ResignationDecisionPresenter.
 *
 * @package namespace App\Presenters;
 */
class ResignationDecisionPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ResignationDecision';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ResignationDecision';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ResignationDecisionTransformer();
    }
}
