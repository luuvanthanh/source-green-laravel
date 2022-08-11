<?php

namespace GGPHP\ApiShare\Middlewares;

use Closure;
use GGPHP\ApiShare\Exceptions\AccessApiException;
use GGPHP\ApiShare\Models\ApiShare;
use GGPHP\VerificationCode\Models\VerificationCode;

class CheckIsShareApiMiddleware
{
    public function handle($request, Closure $next)
    {
        $routeName = $request->route()->getName();

        $apiShare = ApiShare::where('name_route', $routeName)->first();
        if (!$apiShare->is_share) {
            throw AccessApiException::notAccessApi();
        }

        $verificationCode = request()->verification_code;

        if (empty($verificationCode)) {
            throw AccessApiException::notAccessApi();
        }

        $verificationCode  = VerificationCode::where('code', $verificationCode)->first();

        if (is_null($verificationCode)) {
            throw AccessApiException::notAccessApi();
        }

        return $next($request);
    }
}
