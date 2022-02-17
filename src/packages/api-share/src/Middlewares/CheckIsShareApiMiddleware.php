<?php

namespace GGPHP\ApiShare\Middlewares;

use Closure;
use GGPHP\ApiShare\Exceptions\AccessApiException;
use GGPHP\ApiShare\Models\ApiShare;

class CheckIsShareApiMiddleware
{
    public function handle($request, Closure $next)
    {
        $routeName = $request->route()->getName();

        $apiShare = ApiShare::where('name_route', $routeName)->first();
        if (!$apiShare->is_share) {
            throw AccessApiException::notAccessApi();
        }

        return $next($request);
    }
}
