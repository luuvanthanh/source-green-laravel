<?php

namespace GGPHP\Bio\Presenters;

use GGPHP\Bio\Transformers\BioTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class BioPresenter.
 *
 * @package namespace App\Presenters;
 */
class BioPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Bio';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Bio';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new BioTransformer();
    }
}
