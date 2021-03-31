<?php

namespace GGPHP\Fingerprint\Presenters;

use GGPHP\Fingerprint\Transformers\FingerprintTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class FingerprintPresenter.
 *
 * @package namespace GGPHP\Fingerprints\Presenters;
 */
class FingerprintPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Fingerprint';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Fingerprint';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new FingerprintTransformer();
    }
}
