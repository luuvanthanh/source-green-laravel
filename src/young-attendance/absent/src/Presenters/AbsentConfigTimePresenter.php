<?php

namespace GGPHP\YoungAttendance\Absent\Presenters;

use GGPHP\YoungAttendance\Absent\Transformers\AbsentConfigTimeTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class UserPresenter.
 *
 * @package namespace App\Presenters;
 */
class AbsentConfigTimePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'AbsentConfigTime';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'AbsentConfigTime';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new AbsentConfigTimeTransformer();
    }
}
