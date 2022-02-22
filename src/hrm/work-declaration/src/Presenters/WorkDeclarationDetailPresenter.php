<?php

namespace GGPHP\WorkDeclaration\Presenters;

use GGPHP\WorkDeclaration\Transformers\WorkDeclarationDetailTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class WorkDeclarationDetailPresenter.
 *
 * @package namespace App\Presenters;
 */
class WorkDeclarationDetailPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'WorkDeclarationDetail';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'WorkDeclarationDetail';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new WorkDeclarationDetailTransformer();
    }
}
