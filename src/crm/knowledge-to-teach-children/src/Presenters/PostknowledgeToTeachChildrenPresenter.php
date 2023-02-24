<?php

namespace GGPHP\Crm\knowledgeToTeachChildren\Presenters;

use GGPHP\Crm\KnowledgeToTeachChildren\Transformers\PostKnowledgeToTeachChildrenTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class StatusParentPotentialPresenter.
 *
 * @package namespace App\Presenters;
 */
class PostknowledgeToTeachChildrenPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'PostKnowledgeToTeachChildren';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'PostKnowledgeToTeachChildren';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new PostKnowledgeToTeachChildrenTransformer();
    }
}
