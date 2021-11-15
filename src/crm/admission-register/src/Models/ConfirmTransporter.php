<?php

namespace GGPHP\Crm\AdmissionRegister\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Category\Models\CategoryRelationship;

class ConfirmTransporter extends UuidModel
{

    protected $table = 'confirm_transporters';

    protected $fillable = [
        'full_name', 'relationship', 'id_card', 'file_image', 'admission_register_id', 'phone', 'category_relationship_id'
    ];

    public function admissionRegister()
    {
        return $this->belongsTo(AdmissionRegister::class);
    }

    public function categoryRelationship()
    {
        return $this->belongsTo(CategoryRelationship::class);
    }
}
