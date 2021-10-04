<?php

namespace GGPHP\Fee\Presenters;

use GGPHP\Fee\Transformers\ChangeParameterDetailTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ChangeParameterDetailPresenter.
 *
 * @package namespace App\Presenters;
 */
class ChangeParameterDetailPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ChangeParameterDetail';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ChangeParameterDetail';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ChangeParameterDetailTransformer();
    }
}
