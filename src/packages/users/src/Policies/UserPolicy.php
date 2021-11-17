<?php

namespace GGPHP\Users\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use GGPHP\Users\Models\User;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function before($user, $ability)
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the user.
     *
     * @param  GGPHP\Users\Models\User  $authenticatedUser
     * @param  GGPHP\Users\Models\User  $userId
     * @return boolean true on permitted
     */
    public function update(User $authenticatedUser, User $user)
    {
        return $authenticatedUser->id == $user->id;
    }
}
