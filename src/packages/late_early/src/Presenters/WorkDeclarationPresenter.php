<?php

namespace GGPHP\LateEarly\Presenters;

use GGPHP\LateEarly\Transformers\WorkDeclarationTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class WorkDeclarationPresenter.
 *
 * @package namespace App\Presenters;
 */
class WorkDeclarationPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'WorkDeclaration';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'WorkDeclaration';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new WorkDeclarationTransformer();
    }
}
