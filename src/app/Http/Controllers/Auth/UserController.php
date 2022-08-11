<?php

namespace App\Http\Controllers\Auth;

use App\Http\Requests\RegisterRequest;
use CloudCreativity\LaravelJsonApi\Contracts\Store\StoreInterface;
use CloudCreativity\LaravelJsonApi\Http\Controllers\JsonApiController;

class UserController extends JsonApiController
{
    // protected $resourceType = 'users';
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */
    public function register(StoreInterface $store, RegisterRequest $request): \Illuminate\Http\Response
    {
        $record = $this->transaction(function () use ($store, $request) {
            $user = $this->doCreate($store, $request);

            return $user;
        });

        if ($this->isResponse($record)) {
            return $record;
        }

        return $this->reply()->created($record);
    }
}
