<?php

namespace GGPHP\Crm\Marketing\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class PostFacebookInfo extends UuidModel
{
    use SoftDeletes;

    protected $table = 'post_facebook_infos';

    protected $fillable = [
        'quantity_reaction', 'quantity_comment', 'quantity_share', 'article_id', 'facebook_post_id', 'video_id'
    ];
}
