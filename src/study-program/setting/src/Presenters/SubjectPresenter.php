<?php

namespace GGPHP\StudyProgram\Setting\Presenters;

use GGPHP\StudyProgram\Setting\Transformers\SubjectTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ReviewPresenter.
 *
 * @package namespace App\Presenters;
 */
class SubjectPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Subject';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Subject';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new SubjectTransformer();
    }
}
