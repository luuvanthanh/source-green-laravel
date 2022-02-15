<?php

namespace GGPHP\Tariff\ConfigContent\Models;

use GGPHP\Core\Models\UuidModel;

class ConfigContentDetail extends UuidModel
{
    protected $table = 'fee.ConfigContentDetails';

    protected $fillable = [
        'FormName', 'Content', 'ConfigContentId'
    ];

    public function configContent()
    {
        return $this->belongsTo(ConfigContent::class, 'ConfigContentId');
    }
}
