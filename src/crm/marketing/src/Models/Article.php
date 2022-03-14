<?php

namespace GGPHP\Crm\Marketing\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends UuidModel
{
    use SoftDeletes;

    protected $table = 'articles';

    protected $fillable = [
        'name', 'content', 'file_image', 'marketing_program_id',
    ];

    public function marketingProgram()
    {
        return $this->belongsTo(MarketingProgram::class);
    }

    public function postFacebookInfo()
    {
        return $this->hasOne(PostFacebookInfo::class);
    }
}
