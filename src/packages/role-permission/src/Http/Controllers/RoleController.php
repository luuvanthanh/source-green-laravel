<?php

namespace GGPHP\RolePermission\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\RolePermission\Http\Requests\RoleAssignPermissionRequest;
use GGPHP\RolePermission\Http\Requests\RoleCreateRequest;
use GGPHP\RolePermission\Http\Requests\RoleUpdateRequest;
use GGPHP\RolePermission\Repositories\Contracts\RoleRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RoleController extends Controller
{
    /**
     * @var RoleRepository
     */
    protected $roleRepository;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct(RoleRepository $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = config('constants.SEARCH_VALUES_DEFAULT.LIMIT');
        if ($request->has('limit')) {
            $limit = $request->limit;
        }

        if ($limit == config('constants.SEARCH_VALUES_DEFAULT.LIMIT_ZERO')) {
            $role = $this->roleRepository->all();
        } else {
            $role = $this->roleRepository->paginate($limit);
        }

        return $this->success($role, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(RoleCreateRequest $request)
    {
        $data = $request->all();
        $data['guard_name'] = 'api';
        $role = $this->roleRepository->create($data);

        return $this->success($role, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
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
        $role = $this->roleRepository->find($id);
        return $this->success($role, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(RoleUpdateRequest $request, $id)
    {
        $role = $this->roleRepository->update($request->all(), $id);
        return $this->success([], trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
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
        $this->roleRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    /**
     * Assign permissions to role
     *
     * @param RoleAssignPermissionRequest $request
     * @param type $id
     * @return type
     */
    public function updatePermissionForRole(RoleAssignPermissionRequest $request)
    {
        $roles = $this->roleRepository->updatePermissionForRole($request->all());

        return $this->success($roles, trans('lang::messages.common.getInfoSuccess'));
    }
}
