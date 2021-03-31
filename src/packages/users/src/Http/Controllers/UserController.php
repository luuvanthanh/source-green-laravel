<?php

namespace GGPHP\Users\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Users\Http\Requests\UserCreateRequest;
use GGPHP\Users\Http\Requests\UserUpdateRequest;
use GGPHP\Users\Repositories\Contracts\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

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

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $users = $this->userRepository->all();

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
        $user = $this->userRepository->findUser($request->all(), $id);

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
        $user = $this->userRepository->update($request->all(), $id);

        return $this->success($user, trans('lang::messages.common.modifySuccess'));
    }
}
