<?php

namespace GGPHP\SurveyForm\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use GGPHP\Core\Models\UuidModel;

class SurveyForm extends UuidModel
{
    use Sluggable;
    use SoftDeletes;

    protected $table = 'surveys';

    protected $fillable = [
        'name', 'description', 'tourist_destination_id', 'start_date', 'end_date', 'slug', 'json',
    ];

    protected $casts = [
        'json'  =>  'array',
    ];

    /**
     * Return the sluggable configuration array for this model.
     *
     * @return array
     */
    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name',
                'separator' => '_',
                'unique' => true,
            ],
        ];
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function results()
    {
        return $this->hasMany(\GGPHP\SurveyForm\Models\SurveyFormResult::class, 'survey_id');
    }

    public function touristDestination()
    {
        return $this->belongsTo(\GGPHP\Category\Models\TouristDestination::class);
    }
}
