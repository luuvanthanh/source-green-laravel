<?php

namespace GGPHP\Crm\knowledgeToTeachChildren\Presenters;

use GGPHP\Crm\KnowledgeToTeachChildren\Transformers\CategoryKnowledgeToTeachChildrenTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class StatusParentPotentialPresenter.
 *
 * @package namespace App\Presenters;
 */
class CategoryknowledgeToTeachChildrenPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'CategoryKnowledgeToTeachChildren';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'CategoryKnowledgeToTeachChildren';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CategoryKnowledgeToTeachChildrenTransformer();
    }
}
