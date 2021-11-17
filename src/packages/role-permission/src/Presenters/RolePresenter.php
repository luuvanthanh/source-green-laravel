<?php

namespace GGPHP\RolePermission\Presenters;

use GGPHP\RolePermission\Transformers\RoleTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class RolesPresenter.
 *
 * @package namespace App\Presenters;
 */
class RolePresenter extends FractalPresenter
{
    protected $resourceKeyItem = 'Role';
    protected $resourceKeyCollection = 'Role';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new RoleTransformer();
    }
}
