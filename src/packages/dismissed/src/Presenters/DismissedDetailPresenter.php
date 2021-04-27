<?php

namespace GGPHP\Dismissed\Presenters;

use GGPHP\Dismissed\Transformers\DismissedDetailTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class DismissedDetailPresenter.
 *
 * @package namespace App\Presenters;
 */
class DismissedDetailPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'DismissedDetail';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'DismissedDetail';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new DismissedDetailTransformer();
    }
}
