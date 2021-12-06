<?php

namespace GGPHP\ChildDevelop\ChildEvaluate\Presenters;

use GGPHP\ChildDevelop\ChildEvaluate\Transformers\ChildEvaluateTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ReviewPresenter.
 *
 * @package namespace App\Presenters;
 */
class ChildEvaluatePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ChildEvaluate';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ChildEvaluate';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ChildEvaluateTransformer();
    }
}
