<?php

namespace GGPHP\Core\Middlewares;

use Closure;
use GGPHP\Camera\Models\Camera;
use GGPHP\Category\Models\TouristDestination;
use GGPHP\Event\Models\Event;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class CheckViewScope
{
    public function handle($request, Closure $next)
    {
        $user = Auth::user();

        if (!$user->is_all_tourist_destination) {
            $touristDestination = $user->touristDestination->pluck('id')->toArray();

            TouristDestination::addGlobalScope('where_of_user', function (Builder $builder) use ($touristDestination) {
                $builder->whereIn('id', $touristDestination);
            });
            Event::addGlobalScope('where_of_user', function (Builder $builder) use ($touristDestination) {
                $builder->whereIn('tourist_destination_id', $touristDestination);
            });
        }

        if (!$user->is_all_camera) {
            $camera =  $user->camera->pluck('id')->toArray();
            Camera::addGlobalScope('where_of_user', function (Builder $builder) use ($camera) {
                $builder->whereIn('id', $camera);
            });
        }

        return $next($request);
    }
}
