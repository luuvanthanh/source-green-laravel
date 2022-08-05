<?php

namespace GGPHP\TeacherTimekeeping\Presenters;

use GGPHP\TeacherTimekeeping\Transformers\TeacherTimekeepingTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class UserPresenter.
 *
 * @package namespace App\Presenters;
 */
class TeacherTimekeepingPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'TeacherTimekeeping';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'TeacherTimekeeping';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TeacherTimekeepingTransformer();
    }
}
