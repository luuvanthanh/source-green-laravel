<?php

namespace GGPHP\RolePermission\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\RolePermission\Http\Requests\PermissionCreateRequest;
use GGPHP\RolePermission\Http\Requests\PermissionUpdateRequest;
use GGPHP\RolePermission\Imports\PermissionImport;
use GGPHP\RolePermission\Models\Permission;
use GGPHP\RolePermission\Models\Role;
use GGPHP\RolePermission\Repositories\Contracts\PermissionRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Maatwebsite\Excel\Facades\Excel;

class PermissionController extends Controller
{
    /**
     * @var PermissionRepository
     */
    protected $permissionRepository;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct(PermissionRepository $permissionRepository)
    {
        $this->permissionRepository = $permissionRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $permission = $this->permissionRepository->getPermission($request->all());

        return $this->success($permission, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(PermissionCreateRequest $request)
    {
        $permissions = $this->permissionRepository->create($request->all());

        return $this->success($permissions, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $permission = $this->permissionRepository->find($id);

        return $this->success($permission, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(PermissionUpdateRequest $request, $id)
    {
        $permission = $this->permissionRepository->update($request->all(), $id);

        return $this->success($permission, trans('lang::messages.common.updateSuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->permissionRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function import()
    {
        $permission = Permission::pluck('id')->toArray();

        $role = Role::first();

        dd($role->permissions()->sync($permission));
        Excel::import(new PermissionImport, request()->file('file'));

        return $this->success([], trans('lang::messages.common.importExcelSuccess'));
    }
}
