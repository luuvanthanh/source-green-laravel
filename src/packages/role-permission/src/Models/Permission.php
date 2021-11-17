<?php

namespace GGPHP\RolePermission\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Spatie\Permission\Models\Permission as OriginalPermission;

class Permission extends OriginalPermission
{
    use Sluggable;

    public $guard_name = 'api';

    /**
     * Return the sluggable configuration array for this model.
     *
     * @return array
     */
    public function sluggable()
    {
        return [
            'group_slug' => [
                'source' => 'group',
                'separator' => '_',
                'unique' => false,
            ],
        ];
    }
}
