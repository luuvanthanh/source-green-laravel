<?php

namespace GGPHP\ChildDevelop\TestSemester\Presenters;

use GGPHP\ChildDevelop\TestSemester\Transformers\TestSemesterTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ReviewPresenter.
 *
 * @package namespace App\Presenters;
 */
class TestSemesterPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'TestSemester';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'TestSemester';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TestSemesterTransformer();
    }
}
