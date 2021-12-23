<?php

namespace GGPHP\SurveyForm\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class SurveyFormResult extends UuidModel
{
    use SoftDeletes;

    protected $table = 'survey_results';

    protected $fillable = [
        'survey_id', 'ip_address', 'json',
    ];

    protected $casts = [
        'json'  =>  'array',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function survey()
    {
        return $this->belongsTo('GGPHP\SurveyForm\Models\Survey', 'survey_id');
    }
}
