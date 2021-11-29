<?php

namespace GGPHP\Crm\Facebook\Presenters;

use GGPHP\Crm\Facebook\Transformers\MessageTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class MessagePresenter.
 *
 * @package namespace App\Presenters;
 */
class MessagePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Message';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Message';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new MessageTransformer();
    }
}
