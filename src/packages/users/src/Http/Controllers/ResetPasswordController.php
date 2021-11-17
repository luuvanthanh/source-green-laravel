<?php

namespace GGPHP\Users\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ResetPasswordController extends Controller
{
    use ResetsPasswords;

    protected function sendResetResponse($response)
    {
        return $this->success([], trans('lang::messages.auth.resetPasswordSuccess'), false);
    }

    protected function rules()
    {
        return [
            'token' => 'required',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|confirmed|min:8',
        ];
    }

    protected function sendResetFailedResponse(Request $request, $response)
    {
        return $this->error(trans('lang::messages.auth.resetPasswordFail'), trans($response), Response::HTTP_BAD_REQUEST);
    }
}
