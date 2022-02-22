<?php

namespace GGPHP\Appoint\Presenters;

use GGPHP\Appoint\Transformers\AppointTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class AppointPresenter.
 *
 * @package namespace App\Presenters;
 */
class AppointPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Appoint';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Appoint';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new AppointTransformer();
    }
}
