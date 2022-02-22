<?php

namespace GGPHP\Profile\Presenters;

use GGPHP\Profile\Transformers\LabourContractTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class LabourContractPresenter.
 *
 * @package namespace GGPHP\Profile\Presenters;
 */
class LabourContractPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'LabourContract';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'LabourContract';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new LabourContractTransformer();
    }
}
