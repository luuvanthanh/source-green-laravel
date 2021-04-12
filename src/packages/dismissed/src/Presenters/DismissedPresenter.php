<?php

namespace GGPHP\Dismissed\Presenters;

use GGPHP\Dismissed\Transformers\DismissedTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class DismissedPresenter.
 *
 * @package namespace App\Presenters;
 */
class DismissedPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Dismissed';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Dismissed';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new DismissedTransformer();
    }
}
