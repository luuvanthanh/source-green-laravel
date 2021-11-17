<?php

namespace GGPHP\RolePermission\Middlewares;

use Closure;
use Spatie\Permission\Exceptions\UnauthorizedException;

class PermissionForRoleMiddleware
{
    public function handle($request, Closure $next, $permission)
    {

        $listPermissionUser = [];
        if (app('auth')->guest()) {
            throw UnauthorizedException::notLoggedIn();
        }

        $permissions = explode('|', $permission);

        $permissionOfRole = app('auth')->user()->roles->first()->permissions;
        $permissionOfUser = app('auth')->user()->permissions;

        $totalPermissions = $permissionOfRole->merge($permissionOfUser);

        foreach ($totalPermissions as $value) {
            $listPermissionUser[] = $value->name;
        }

        $request->listPermissionUser = $listPermissionUser;

        foreach ($permissions as $value) {
            if (in_array($value, $listPermissionUser)) {
                return $next($request);
            }
        }
        throw UnauthorizedException::forPermissions($permissions);
    }
}
