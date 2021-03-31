<?php

namespace GGPHP\Users\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Users\Http\Requests\ChangePasswordRequest;
use GGPHP\Users\Repositories\Contracts\UserRepository;
use GGPHP\Users\Traits\RFIDLogin;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    use RFIDLogin;
    /**
     * @var UserRepository
     */
    protected $userRepository;

    /**
     * UserController constructor.
     *
     * @param UserRepository $userRepository
     */
    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * authenticated
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function authenticated(Request $request)
    {
        $user = $this->userRepository->find(Auth::id());
        return $this->success($user, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function logout(Request $request)
    {
        if (!empty($request->player_id)) {
            $this->userRepository->deletePlayer($request->player_id, $request->user()->id);
        }

        $request->user()->token()->revoke();

        return $this->success([], trans('lang::messages.auth.logoutSuccess'), ['isShowData' => false]);
    }

    /**
     * Change password
     *
     * @param ChangePasswordRequest $request
     *
     * @return \Illuminate\Http\Response
     */
    public function changePassword(ChangePasswordRequest $request)
    {
        $user = $this->userRepository->update(['password' => Hash::make($request->password)], $request->user_id);

        return $this->success($user, trans('lang::messages.auth.changePasswordSuccess'));
    }
}
