<?php

namespace GGPHP\Profile\Presenters;

use GGPHP\Profile\Transformers\InsurranceTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class InsurrancePresenter.
 *
 * @package namespace GGPHP\Profile\Presenters;
 */
class InsurrancePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Insurrance';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Insurrance';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new InsurranceTransformer();
    }
}
