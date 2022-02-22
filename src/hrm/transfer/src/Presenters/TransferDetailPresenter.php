<?php

namespace GGPHP\Transfer\Presenters;

use GGPHP\Transfer\Transformers\TransferDetailTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class TransferDetailPresenter.
 *
 * @package namespace App\Presenters;
 */
class TransferDetailPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'TransferDetail';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'TransferDetail';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TransferDetailTransformer();
    }
}
