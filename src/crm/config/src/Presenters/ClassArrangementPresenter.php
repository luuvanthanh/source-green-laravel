<?php

namespace GGPHP\Crm\Config\Presenters;

use GGPHP\Crm\Config\Transformers\ClassArrangementTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class ClassArrangementPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ClassArrangement';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ClassArrangement';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ClassArrangementTransformer();
    }
}
