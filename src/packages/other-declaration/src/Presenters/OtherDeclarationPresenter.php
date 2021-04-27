<?php

namespace GGPHP\OtherDeclaration\Presenters;

use GGPHP\OtherDeclaration\Transformers\OtherDeclarationTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class OtherDeclarationPresenter.
 *
 * @package namespace App\Presenters;
 */
class OtherDeclarationPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'OtherDeclaration';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'OtherDeclaration';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new OtherDeclarationTransformer();
    }
}
