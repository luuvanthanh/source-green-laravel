<?php

namespace ZK\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;
use ZK\Models\ZKSync;

trait SyncToDevice
{
    protected $enableLoggingModelsEvents = true;

    protected static function bootSyncToDevice()
    {
        static::eventsToBeRecorded()->each(function ($eventName) {
            return static::$eventName(function (Model $model) use ($eventName) {
                $data = $model->toArray();
                $data['Id'] = $model->Id;
                $model->activities()->create([
                    'Action' => $eventName,
                    'Payload' => json_encode($data),
                ]);
            });
        });
    }

    public function activities(): MorphMany
    {
        return $this->morphMany(ZKSync::class, 'Subject', 'SubjectType', 'SubjectId');
    }

    /*
     * Get the event names that should be recorded.
     */
    protected static function eventsToBeRecorded(): Collection
    {
        if (isset(static::$recordEvents)) {
            return collect(static::$recordEvents);
        }

        $events = collect([
            'created',
            'updated',
            'deleted',
        ]);

        if (collect(class_uses_recursive(static::class))->contains(SoftDeletes::class)) {
            $events->push('restored');
        }

        return $events;
    }
}
