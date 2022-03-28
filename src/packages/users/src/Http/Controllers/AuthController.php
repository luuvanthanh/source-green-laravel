<?php

namespace GGPHP\Users\Http\Controllers;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use GGPHP\Users\Http\Requests\EgovLoginRequest;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Contracts\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use League\OAuth2\Server\Exception\OAuthServerException;
use Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AuthController extends Controller
{


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
    public function logged(Request $request)
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
        $cas = app('cas');
        $cas->logout();

        return $this->success([], trans('lang::messages.auth.logoutSuccess'), ['isShowData' => false]);
    }

    /**
     * Attempt to log the user into the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response result response
     */
    protected function attemptLogin(Request $request)
    {
        $credentials = $this->credentials($request);
        $request = Request::create(
            '/oauth/token',
            'post',
            [
                'grant_type' => env('API_GRANT_TYPE'),
                'client_id' => env('API_CLIENT_ID'),
                'client_secret' => env('API_CLIENT_SECRET'),
                'username' => $credentials[$this->username()],
                'password' => $credentials['password'],
            ]
        );
        $resp = app()->handle($request);
        $content = json_decode($resp->content(), true);
        if ($resp->status() !== 200) {
            throw new \League\OAuth2\Server\Exception\OAuthServerException($content['message'], 401, $content['error'], $resp->status());
        }
        return $content;
    }

    /**
     * Get the needed authorization credentials from the request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    protected function credentials(Request $request)
    {
        return $request->only($this->username(), 'password');
    }

    /**
     * Get the login username to be used by the controller.
     *
     * @return string
     */
    public function username()
    {
        return 'email';
    }

    /**
     * Get the guard to be used during authentication.
     *
     * @return \Illuminate\Contracts\Auth\StatefulGuard
     */
    protected function guard()
    {
        return Auth::guard('api');
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

    public function egovLogin(Request $request)
    {
        $cas = app('cas');
        try {
            $cas->authenticate();

            $userEgov = $cas->user();
            $user = User::where('email', $userEgov)->first();

            if (is_null($user)) {
                $request->session()->flush();
                throw new HttpException(500, 'Người dùng không có quyền truy cập vào hệ thống!');
            }

            $objToken = $user->createToken('token-egov');
            $strToken = $objToken->accessToken;

            return redirect(env('WEB_CALL_BACK_LOGIN_EGOV') . '?token=' . $strToken);
        } catch (\Throwable $th) {
            throw new HttpException(500, 'Đăng nhập egov không thành công!');
        }
    }
}
