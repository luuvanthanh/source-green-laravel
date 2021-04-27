<?php

namespace GGPHP\InOutHistories\Presenters;

use GGPHP\InOutHistories\Transformers\InOutHistoriesTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class InOutHistoriesPresenter.
 *
 * @package namespace App\Presenters;
 */
class InOutHistoriesPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'InOutHistories';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'InOutHistories';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new InOutHistoriesTransformer();
    }
}
