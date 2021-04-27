<?php

namespace GGPHP\Transfer\Presenters;

use GGPHP\Transfer\Transformers\TransferTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class TransferPresenter.
 *
 * @package namespace App\Presenters;
 */
class TransferPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Transfer';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Transfer';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TransferTransformer();
    }
}
