<?php

namespace GGPHP\Tariff\ConfigContent\Models;

use GGPHP\Core\Models\UuidModel;

class ConfigContent extends UuidModel
{
    protected $table = 'fee.ConfigContents';

    protected $fillable = [
        'PaymentTime', 'Content'
    ];

    public function configContentDetail()
    {
        return $this->hasMany(ConfigContentDetail::class, 'ConfigContentId');
    }
}
