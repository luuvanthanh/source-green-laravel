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
                $role->permissions()->sync($attributes['permission_id']);
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
                $role->permissions()->detach();
                $role->permissions()->sync($attributes['permission_id']);
            }
            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
        }

        return parent::find($id);
    }
}
