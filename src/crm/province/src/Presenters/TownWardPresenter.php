<?php

namespace GGPHP\Crm\Province\Presenters;

use GGPHP\Crm\Province\Transformers\TownWardTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class TownWardPresenter.
 *
 * @package namespace App\Presenters;
 */
class TownWardPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'TownWard';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'TownWard';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TownWardTransformer();
    }
}
