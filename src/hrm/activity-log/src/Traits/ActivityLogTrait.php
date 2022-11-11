<?php

namespace GGPHP\ActivityLog\Traits;

use GGPHP\ActivityLog\Models\ActivityLog;
use GGPHP\ActivityLog\Repositories\Contracts\ActivityLogRepository;
use GGPHP\Users\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Http;

trait ActivityLogTrait
{
    public static function boot()
    {
        parent::boot();
        $user = self::getUserInfo(request()->bearerToken());
        
        static::created(function ($model) use ($user) {
            $subjectId = $model->Id;
            $subjectType = get_class($model);
            $causerId = $user->Id;
            $causerType = get_class($user);
            $description = 'created';
            $properties = json_encode(request()->all());

            $array = [
                'subjectId' => $subjectId,
                'subjectType' => $subjectType,
                'causerId' => $causerId,
                'causerType' => $causerType,
                'description' => $description,
                'properties' => $properties
            ];

            resolve(ActivityLogRepository::class)->create($array);
        });

        static::updated(function ($model) use ($user) {
            $getChanges = $model->getChanges();
            $properties = json_encode($getChanges);
            $subjectId = $model->Id;
            $subjectType = get_class($model);
            $causerId = $user->Id;
            $causerType = get_class($user);
            $description = 'updated';

            $array = [
                'subjectId' => $subjectId,
                'subjectType' => $subjectType,
                'causerId' => $causerId,
                'causerType' => $causerType,
                'description' => $description,
                'properties' => $properties
            ];

            resolve(ActivityLogRepository::class)->create($array);
        });

        static::deleted(function ($model) use ($user) {
            $subjectId = $model->Id;
            $subjectType = get_class($model);
            $causerId = $user->Id;
            $causerType = get_class($user);
            $description = 'deleted';
            $properties = json_encode($model->toArray());

            $array = [
                'subjectId' => $subjectId,
                'subjectType' => $subjectType,
                'causerId' => $causerId,
                'causerType' => $causerType,
                'description' => $description,
                'properties' => $properties
            ];

            resolve(ActivityLogRepository::class)->create($array);
        });
    }

    public static function getUserInfo($bearerToken): Model
    {
        $ssoUrl = env('SSO_URL') . '/api/user/me';
        
        $response =  Http::withToken($bearerToken)->get($ssoUrl);
        $response = json_decode($response->body(), true);
        $user = new User();

        if (!empty($response)) {
            if (!empty($response['objectInfo'])) {
                if (get_class() == User::class) {
                }
                $user = User::find($response['objectInfo']['id']);
            }
        }

        return $user;
    }

    public function logActivity()
    {
        return $this->hasMany(ActivityLog::class, 'SubjectId')->where('SubjectType', get_class($this));
    }
}
