<?php

namespace GGPHP\Crm\AdmissionRegister\Models;

use GGPHP\Core\Models\UuidModel;


class ConfirmTransporter extends UuidModel
{

    protected $table = 'confirm_transporters';

    protected $fillable = [
        'full_name', 'relationship', 'id_card', 'file_image', 'admission_register_id', 'phone'
    ];

    public function admissionRegister()
    {
        return $this->belongsTo(AdmissionRegister::class);
    }
}
