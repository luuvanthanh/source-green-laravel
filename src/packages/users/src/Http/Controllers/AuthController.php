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
    protected $employeeRepository;

    /**
     * UserController constructor.
     *
     * @param UserRepository $employeeRepository
     */
    public function __construct(UserRepository $employeeRepository)
    {
        $this->employeeRepository = $employeeRepository;
    }

    /**
     * authenticated
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function authenticated(Request $request)
    {
        $employee = $this->employeeRepository->find(Auth::id());
        return $this->success($employee, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function logout(Request $request)
    {
        if (!empty($request->player_id)) {
            $this->employeeRepository->deletePlayer($request->player_id, $request->employee()->Id);
        }

        $request->employee()->token()->revoke();

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
        $employee = $this->employeeRepository->update(['password' => Hash::make($request->password)], $request->EmployeeId);

        return $this->success($employee, trans('lang::messages.auth.changePasswordSuccess'));
    }
}
