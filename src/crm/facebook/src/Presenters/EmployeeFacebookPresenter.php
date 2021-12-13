<?php

namespace GGPHP\Crm\Facebook\Presenters;

use GGPHP\Crm\Facebook\Transformers\EmployeeFacebookTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class EmployeeFacebookPresenter.
 *
 * @package namespace App\Presenters;
 */
class EmployeeFacebookPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'EmployeeFacebook';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'EmployeeFacebook';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new EmployeeFacebookTransformer();
    }
}
