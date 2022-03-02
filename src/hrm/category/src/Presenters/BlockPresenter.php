<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\BlockTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class BlockPresenter.
 *
 * @package namespace App\Presenters;
 */
class BlockPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Block';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Block';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new BlockTransformer();
    }
}
