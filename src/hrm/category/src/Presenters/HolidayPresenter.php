<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\HolidayTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class HolidayPresenter.
 *
 * @package namespace GGPHP\Category\Presenters;
 */
class HolidayPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Holiday';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Holiday';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new HolidayTransformer();
    }
}
