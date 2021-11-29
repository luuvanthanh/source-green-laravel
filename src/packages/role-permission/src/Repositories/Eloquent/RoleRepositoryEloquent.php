<?php

namespace GGPHP\RolePermission\Repositories\Eloquent;

use GGPHP\RolePermission\Models\Role;
use GGPHP\RolePermission\Repositories\Contracts\RoleRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class ImageRepositoryEloquent.
 *
 * @package namespace GGPHP\RolePermission\Repositories\Eloquent;
 */
class RoleRepositoryEloquent extends BaseRepository implements RoleRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'id',
        'name' => 'like',
        'type',
    ];
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Role::class;
    }

    public function presenter()
    {
        return \GGPHP\RolePermission\Presenters\RolePresenter::class;
    }

    /*
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Update permission for role
     *
     * @param array $attributes
     * @return object
     */
    public function updatePermissionForRole(array $attributes)
    {
        //Add permission
        if (!empty($attributes['data_new'])) {
            foreach ($attributes['data_new'] as $value) {
                $role = Role::find($value['role_id']);
                $role->givePermissionTo($value['permission_id']);
            }
        }

        //Remove permission
        if (!empty($attributes['data_delete'])) {
            foreach ($attributes['data_delete'] as $value) {
                $role = Role::find($value['role_id']);
                $role->revokePermissionTo($value['permission_id']);
            }
        }

        return parent::all();
    }

    /**
     * create role
     *
     * @param array $attributes
     * @return object
     */
    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $role = Role::create($attributes);

            if (!empty($attributes['permission_id'])) {
                $role->givePermissionTo($attributes['permission_id']);
            }
            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
        }

        return parent::find($role->id);
    }

    /**
     * create role
     *
     * @param array $attributes
     * @return object
     */
    public function update(array $attributes, $id)
    {
        \DB::beginTransaction();

        try {
            $role = Role::findOrFail($id);

            $role->update($attributes);

            if (!empty($attributes['permission_id'])) {
                $role->syncPermissions($attributes['permission_id']);
            }
            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
        }

        return parent::find($id);
    }
}
