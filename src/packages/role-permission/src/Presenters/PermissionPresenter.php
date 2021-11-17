<?php

namespace GGPHP\RolePermission\Presenters;

use GGPHP\RolePermission\Transformers\PermissionTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class PermissionPresenter.
 *
 * @package namespace GGPHP\RolePermission\Presenters;
 */
class PermissionPresenter extends FractalPresenter
{
    protected $resourceKeyItem = 'Permission';
    protected $resourceKeyCollection = 'Permission';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new PermissionTransformer();
    }
}
