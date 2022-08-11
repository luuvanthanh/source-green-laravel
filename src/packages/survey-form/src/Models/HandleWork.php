<?php

namespace GGPHP\SurveyForm\Models;

use GGPHP\Core\Models\UuidModel;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class HandleWork extends UuidModel implements HasMedia
{
    use InteractsWithMedia;

    protected $table = 'handle_works';

    protected $fillable = [
        'survey_id', 'name', 'performer', 'content'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function survey()
    {
        return $this->belongsTo(\GGPHP\SurveyForm\Models\Survey::class, 'survey_id');
    }
}
