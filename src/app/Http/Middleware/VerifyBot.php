<?php

namespace App\Http\Middleware;

use Closure;

class VerifyBot
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        if (isset($request->hub_challenge)) {
            $challenge = $request->hub_challenge;
            $hub_verify_token = $request->hub_verify_token;
        }

        if ($hub_verify_token === env("VERIFY_TOKEN")) {
            return $challenge;
        }

        return $next($request);
    }
}
