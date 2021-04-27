<?php

namespace ZK\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Arr;

class ZKSync extends Model
{
    const CREATED_AT = 'CreationTime';
    const UPDATED_AT = 'LastModificationTime';

    protected $table = 'ZkSyncs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Payload', 'Action',
    ];

    public function subject(): MorphTo
    {
        return $this->morphTo('Subject', 'SubjectType', 'SubjectId');
    }

    public function scopeForSubject(Builder $query, Model $subject): Builder
    {
        return $query
            ->where('SubjectType', $subject->getMorphClass())
            ->where('SubjectId', $subject->getKey());
    }
}
