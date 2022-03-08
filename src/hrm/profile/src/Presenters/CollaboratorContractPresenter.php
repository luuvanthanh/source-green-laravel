<?php

namespace GGPHP\Profile\Presenters;

use GGPHP\Profile\Transformers\CollaboratorContractTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CollaboratorContractPresenter.
 *
 * @package namespace GGPHP\Profile\Presenters;
 */
class CollaboratorContractPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'CollaboratorContract';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'CollaboratorContract';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CollaboratorContractTransformer();
    }
}
