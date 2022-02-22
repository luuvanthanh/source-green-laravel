<?php

namespace GGPHP\FingerprintTimekeeper\Presenters;

use GGPHP\FingerprintTimekeeper\Transformers\FingerprintTimekeeperTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class FingerprintTimekeeperPresenter.
 *
 * @package namespace GGPHP\FingerprintTimekeeper\Presenters;
 */
class FingerprintTimekeeperPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'FingerprintTimekeeper';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'FingerprintTimekeeper';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new FingerprintTimekeeperTransformer();
    }
}
