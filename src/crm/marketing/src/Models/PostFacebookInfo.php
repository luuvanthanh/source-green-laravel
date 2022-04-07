<?php

namespace GGPHP\Crm\Marketing\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Facebook\Models\Page;
use Illuminate\Database\Eloquent\SoftDeletes;

class PostFacebookInfo extends UuidModel
{
    use SoftDeletes;

    protected $table = 'post_facebook_infos';

    protected $fillable = [
        'quantity_reaction', 'quantity_comment', 'quantity_share', 'article_id', 'facebook_post_id', 'video_id', 'page_id'
    ];

    public function articleReactionInfo()
    {
        return $this->hasMany(ArticleReactionInfo::class);
    }

    public function articleCommentInfo()
    {
        return $this->hasMany(ArticleCommentInfo::class);
    }

    public function page()
    {
        return $this->belongsTo(Page::class);
    }

    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}
