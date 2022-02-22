<?php

namespace GGPHP\OtherDeclaration\Presenters;

use GGPHP\OtherDeclaration\Transformers\OtherDeclarationDetailTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class OtherDeclarationDetailPresenter.
 *
 * @package namespace App\Presenters;
 */
class OtherDeclarationDetailPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'OtherDeclarationDetail';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'OtherDeclarationDetail';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new OtherDeclarationDetailTransformer();
    }
}
