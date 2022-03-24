<?php

namespace GGPHP\Crm\Marketing\Models;

use GGPHP\Core\Models\UuidModel;

class ArticleCommentInfoDetail extends UuidModel
{
    protected $table = 'article_comment_info_details';

    protected $fillable = [
        'full_name', 'phone', 'email', 'content', 'article_comment_info_id', 'interactive_id', 'comment_id', 'parent_id'
    ];
}
