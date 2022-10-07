<?php

namespace GGPHP\BusRegistration\Presenters;

use GGPHP\BusRegistration\Transformers\BusRegistrationTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class BusRegistrationPresenter.
 *
 * @package namespace App\Presenters;
 */
class BusRegistrationPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'BusRegistration';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'BusRegistration';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new BusRegistrationTransformer();
    }
}
