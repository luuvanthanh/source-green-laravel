<?php

namespace GGPHP\VerificationCode\Presenters;

use GGPHP\VerificationCode\Transformers\VerificationCodeTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class VerificationCodePresenter.
 *
 * @package namespace App\Presenters;
 */
class VerificationCodePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'VerificationCode';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'VerificationCode';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new VerificationCodeTransformer();
    }
}
