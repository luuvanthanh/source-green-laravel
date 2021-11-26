<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class CardType extends  UuidModel implements HasMedia
{
    use InteractsWithMedia;
    use SoftDeletes;

    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'card_types';

    public $fillable = [
        'color', 'scope_of_practice', 'duration', 'condition', 'application_form_for_card', 'sequence', 'name'
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('previous_file')->singleFile();
        $this->addMediaCollection('after_file')->singleFile();
    }

    /**
     * Get previousFile
     */
    public function getPreviousFile()
    {
        $previousFile = $this->getMedia('previous_file');

        return $previousFile->isEmpty() ? null : $previousFile->first();
    }

    /**
     * Get afterFile
     */
    public function getAfterFile()
    {
        $afterFile = $this->getMedia('after_file');

        return $afterFile->isEmpty() ? null : $afterFile->first();
    }
}
