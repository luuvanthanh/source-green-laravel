<?php

namespace GGPHP\Core\Http\Middleware;

use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;

class AuthenticateSSO
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function handle($request, Closure $next)
    {
        $bearerToken = $request->bearerToken();

        if (is_null($bearerToken)) {
            throw new AuthenticationException;
        }

        $ssoUrl = env('SSO_URL') . '/api/user/check-token';
        $respone =  Http::withToken($bearerToken)->get($ssoUrl);

        if ($respone->getStatusCode() == Response::HTTP_UNAUTHORIZED || $respone->getStatusCode() == Response::HTTP_INTERNAL_SERVER_ERROR) {
            throw new AuthenticationException;
        }

        $data = json_decode($respone->getBody()->getContents());
        request()->permission = $data->permissionGrants;

        return $next($request);
    }
}
