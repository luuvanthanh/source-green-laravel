<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\TypeOfContractTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class TypeOfContractPresenter.
 *
 * @package namespace App\Presenters;
 */
class TypeOfContractPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'TypeOfContract';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'TypeOfContract';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TypeOfContractTransformer();
    }
}
