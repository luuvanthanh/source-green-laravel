<?php

namespace GGPHP\Users\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Users\Http\Requests\UserCreateRequest;
use GGPHP\Users\Http\Requests\UserUpdatePermissionRequest;
use GGPHP\Users\Http\Requests\UserUpdateProfileRequest;
use GGPHP\Users\Http\Requests\UserUpdateRequest;
use GGPHP\Users\Http\Requests\UserUpdateRoleRequest;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Contracts\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * @var $userRepository
     */
    protected $userRepository;

    /**
     * UserController constructor.
     * @param UserRepository $userRepository
     */
    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function authenticated()
    {
        return $this->success(Auth::user(), trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $users = $this->userRepository->listing($request);
        return $this->success($users, trans('lang::messages.common.getListSuccess'));
    }

    /**
     *
     * @param UserCreateRequest $request
     *
     * @return Response
     */
    public function store(UserCreateRequest $request)
    {
        $user = $this->userRepository->create($request->all());

        return $this->success($user, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * @param Request $request
     * @param $id
     * @return Response
     */
    public function show(Request $request, $id)
    {
        $user = $this->userRepository->find($id);
        return $this->success($user, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     *
     * @param UserUpdateRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(UserUpdateRequest $request, $id)
    {
        $user = $this->userRepository->updateProfile($request->all(), $id);

        return $this->success($user, trans('lang::messages.common.modifySuccess'));
    }

    /**
     *
     * @param  int $id
     *
     * @return Response
     */
    public function destroy($id)
    {
        $this->userRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    /**
     *
     * @param UserUpdateRoleRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function updateRoleUser(UserUpdateRoleRequest $request, $id)
    {
        $user = $this->userRepository->updateRoleUser($request->all(), $id);

        return $this->success($user, trans('lang::messages.common.modifySuccess'));
    }

    /**
     *
     * @param UserUpdatePermissionRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function updatePermissionUser(UserUpdatePermissionRequest $request, $id)
    {
        $user = $this->userRepository->updatePermissionUser($request->all(), $id);

        return $this->success($user, trans('lang::messages.common.modifySuccess'));
    }

    /**
     *
     * @param UserUpdateProfileRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function updateProfile(UserUpdateProfileRequest $request)
    {
        $userId = Auth::id();
        $user = $this->userRepository->updateProfile($request->all(), $userId);

        return $this->success($user, trans('lang::messages.common.modifySuccess'));
    }

}
