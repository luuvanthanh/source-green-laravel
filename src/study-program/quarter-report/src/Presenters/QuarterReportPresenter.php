<?php

namespace GGPHP\StudyProgram\QuarterReport\Presenters;

use GGPHP\StudyProgram\QuarterReport\Transformers\QuarterReportTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ReviewPresenter.
 *
 * @package namespace App\Presenters;
 */
class QuarterReportPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'QuarterReport';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'QuarterReport';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new QuarterReportTransformer();
    }
}
