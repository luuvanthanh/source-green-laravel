<?php

namespace GGPHP\Crm\Facebook\Presenters;

use GGPHP\Crm\Facebook\Transformers\ConversationTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class MessagePresenter.
 *
 * @package namespace App\Presenters;
 */
class ConversationPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Conversation';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Conversation';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ConversationTransformer();
    }
}
