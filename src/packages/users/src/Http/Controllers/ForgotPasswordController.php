<?php

namespace GGPHP\Users\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Users\Http\Requests\ResetPasswordRequest;
use GGPHP\Users\Mail\ResetPassword;
use GGPHP\Users\Repositories\Contracts\UserRepository;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Mail;

class ForgotPasswordController extends Controller
{
    use SendsPasswordResetEmails;

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
     * @param ResetPasswordRequest $request
     * @return \Illuminate\Http\Response
     */
    public function getResetToken(ResetPasswordRequest $request)
    {
        $this->employeeRepository->skipPresenter();
        $email = $request->email;
        $employee = $this->employeeRepository->findByField('email', $email)->first();
        // create reset password token
        $token = $this->broker()->createToken($employee);
        // send mail
        $email = $employee->email;
        $name = $employee->name;
        $domainClient = env('RESET_PASSWORD_URL', 'http://localhost:9001/password/reset');
        $urlClient = $domainClient . '/' . $token;

        try {
            Mail::to($email, $name)->send(new ResetPassword(compact('name', 'urlClient')));
        } catch (\Exception $e) {
            return $this->error(trans('lang::messages.auth.resetPasswordFail'), $e->getMessage(), config('constants.HTTP_STATUS_CODE.SERVER_ERROR'));
        }
        return $this->success([], trans('lang::messages.auth.sendLinkResetPasswordSuccess'), false);
    }
}
