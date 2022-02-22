<?php

namespace GGPHP\Profile\Presenters;

use GGPHP\Profile\Transformers\ProbationaryContractTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ProbationaryContractPresenter.
 *
 * @package namespace GGPHP\Profile\Presenters;
 */
class ProbationaryContractPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ProbationaryContract';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ProbationaryContract';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ProbationaryContractTransformer();
    }
}
