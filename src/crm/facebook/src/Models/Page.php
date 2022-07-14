<?php

namespace GGPHP\Crm\Facebook\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Marketing\Models\PostFacebookInfo;

class Page extends UuidModel
{
    protected $table = 'pages';

    const IMAGE = [
        'JPG' => 'jpg',
        'PNG' => 'png',
        'JPEG' => 'jpeg',
        'JPE' => 'jpe',
    ];

    const SUBSCRIBEDFIELD = 'messages,messaging_postbacks,messaging_optins,messaging_optouts,message_deliveries,message_reads,messaging_payments,messaging_pre_checkouts,messaging_checkout_updates,messaging_account_linking,messaging_referrals,message_echoes,messaging_game_plays,standby,messaging_handovers,messaging_policy_enforcement,message_reactions,inbox_labels,messaging_feedback,messaging_customer_information,feed';

    protected $fillable = [
        'page_id_facebook', 'name',
    ];
 
    public function conversation()
    {
        return $this->hasMany(Conversation::class);
    }

    public function postFacebookInfo()
    {
        return $this->hasMany(PostFacebookInfo::class);
    }
}
