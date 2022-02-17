<?php

namespace GGPHP\Crm\Config\Presenters;

use GGPHP\Crm\Config\Transformers\ConfigMedicalDeclareTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class ConfigMedicalDeclarePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ConfigMedicalDeclare';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ConfigMedicalDeclare';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ConfigMedicalDeclareTransformer();
    }
}
