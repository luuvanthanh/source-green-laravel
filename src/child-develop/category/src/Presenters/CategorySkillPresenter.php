<?php

namespace GGPHP\ChildDevelop\Category\Presenters;

use GGPHP\ChildDevelop\Category\Transformers\CategorySkillTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class CategorySkillPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'CategorySkill';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'CategorySkill';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CategorySkillTransformer();
    }
}
