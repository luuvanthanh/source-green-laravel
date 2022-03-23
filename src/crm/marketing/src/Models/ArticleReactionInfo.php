<?php

namespace GGPHP\Crm\Marketing\Models;

use GGPHP\Core\Models\UuidModel;

class ArticleReactionInfo extends UuidModel
{
    protected $table = 'article_reaction_infos';

    protected $fillable = [
        'full_name', 'phone', 'email', 'reaction_type', 'post_facebook_info_id', 'interactive_id'
    ];
}
