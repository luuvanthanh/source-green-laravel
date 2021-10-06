<?php

namespace GGPHP\Crm\Marketing\Presenters;

use GGPHP\Crm\Marketing\Transformers\DataMarketingStudentInfoTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CityPresenter.
 *
 * @package namespace App\Presenters;
 */
class DataMarketingStudentInfoPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'StudentInfo';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'StudentInfo';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new DataMarketingStudentInfoTransformer();
    }
}
