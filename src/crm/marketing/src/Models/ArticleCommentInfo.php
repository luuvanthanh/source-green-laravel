<?php

namespace GGPHP\Crm\Marketing\Models;

use GGPHP\Core\Models\UuidModel;

class ArticleCommentInfo extends UuidModel
{
    protected $table = 'article_comment_infos';

    protected $fillable = [
        'full_name', 'phone', 'email', 'content', 'post_facebook_info_id', 'interactive_id', 'comment_id', 'parent_id'
    ];

    public function articleCommentInfoDetail()
    {
        return $this->hasMany(ArticleCommentInfoDetail::class);
    }

    public function postFacebookInfo()
    {
        return $this->belongsTo(PostFacebookInfo::class);
    }
}
