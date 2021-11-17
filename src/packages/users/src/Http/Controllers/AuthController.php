<?php

namespace GGPHP\Users\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Users\Repositories\Contracts\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use League\OAuth2\Server\Exception\OAuthServerException;
use Response;

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
        $request->user()->token()->revoke();
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
}
