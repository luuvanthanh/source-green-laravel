<?php

namespace GGPHP\Users\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Users\Http\Requests\ResetPasswordRequest;
use GGPHP\Users\Jobs\SendEmail;
use GGPHP\Users\Mail\ResetPassword;
use GGPHP\Users\Repositories\Contracts\UserRepository;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;

class ForgotPasswordController extends Controller
{
    use SendsPasswordResetEmails;

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
     * @param ResetPasswordRequest $request
     * @return \Illuminate\Http\Response
     */
    public function getResetToken(ResetPasswordRequest $request)
    {
        $this->userRepository->skipPresenter();
        $email = $request->email;
        $user = $this->userRepository->findByField('email', $email)->first();
        // create reset password token
        $token = $this->broker()->createToken($user);
        // send mail
        $email = $user->email;
        $name = $user->name;
        $domainClient = env('RESET_PASSWORD_URL', 'http://localhost:11000/password/reset');
        $urlReset = $domainClient . '?token=' . $token;

        // send mail
        $dataMail = [
            'email' => $user->email,
            'name' => $user->fullname,
            'url_reset' => $urlReset,
        ];

        try {
            dispatch(new SendEmail($dataMail, 'FORGOT_PASSWORD'));
        } catch (\Exception $e) {
            return $this->error(trans('lang::messages.auth.resetPasswordFail'), $e->getMessage(), config('constants.HTTP_STATUS_CODE.SERVER_ERROR'));
        }
        return $this->success([], trans('lang::messages.auth.sendLinkResetPasswordSuccess'), false);
    }
}
