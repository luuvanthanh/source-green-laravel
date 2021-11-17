<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\LanguageTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class LanguagePresenter.
 *
 * @package namespace App\Presenters;
 */
class LanguagePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Language';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Language';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new LanguageTransformer();
    }
}
