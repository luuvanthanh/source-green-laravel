<?php

namespace GGPHP\Absent\Presenters;

use GGPHP\Absent\Transformers\AbsentTypeTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class UserPresenter.
 *
 * @package namespace App\Presenters;
 */
class AbsentTypePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'AbsentType';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'AbsentType';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new AbsentTypeTransformer();
    }
}
