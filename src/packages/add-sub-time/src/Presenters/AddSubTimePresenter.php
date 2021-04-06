<?php

namespace GGPHP\AddSubTime\Presenters;

use GGPHP\AddSubTime\Transformers\AddSubTimeTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class AddSubTimePresenter.
 *
 * @package namespace GGPHP\AddSubTime\Presenters;
 */
class AddSubTimePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'AddSubTime';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'AddSubTime';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new AddSubTimeTransformer();
    }
}
