<?php

namespace GGPHP\Fee\Presenters;

use GGPHP\Fee\Transformers\PotentialStudentTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class PotentialStudentPresenter.
 *
 * @package namespace App\Presenters;
 */
class PotentialStudentPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'PotentialStudent';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'PotentialStudent';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new PotentialStudentTransformer();
    }
}
