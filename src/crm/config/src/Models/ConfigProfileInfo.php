<?php

namespace GGPHP\Crm\Config\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConfigProfileInfo extends UuidModel
{
    use SoftDeletes;

    protected $table = 'config_profile_infos';

    protected $fillable = [
        'name'
    ];
}
