<?php

namespace GGPHP\Crm\Config\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConfigMedicalDeclare extends UuidModel
{
    use SoftDeletes;

    protected $table = 'config_medical_declares';

    const TYPE = [
        'RADIO' => 0,
        'CHECKBOX' => 1,
        'TEXTBOX' => 2
    ];

    protected $fillable = [
        'name', 'type', 'text_box', 'use', 'use_yes_or_no', 'use_input'
    ];

    public function configMedicalDeclareDetail()
    {
        return $this->hasMany(ConfigMedicalDeclareDetail::class, 'config_madical_declare_id');
    }
}
