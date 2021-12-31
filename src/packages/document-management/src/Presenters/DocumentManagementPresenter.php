<?php

namespace GGPHP\DocumentManagement\Presenters;

use GGPHP\DocumentManagement\Transformers\DocumentManagementTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class DocumentManagementPresenter.
 *
 * @package namespace GGPHP\DocumentManagement\Presenters;
 */
class DocumentManagementPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'DocumentManagement';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'DocumentManagement';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new DocumentManagementTransformer();
    }
}
