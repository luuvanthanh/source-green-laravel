<?php

namespace GGPHP\Appoint\Presenters;

use GGPHP\Appoint\Transformers\AppointDetailTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class AppointDetailPresenter.
 *
 * @package namespace App\Presenters;
 */
class AppointDetailPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'AppointDetail';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'AppointDetail';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new AppointDetailTransformer();
    }
}
