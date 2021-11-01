<?php

namespace GGPHP\Crm\AdmissionRegister\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Province\Models\City;
use GGPHP\Crm\Province\Models\District;
use Illuminate\Database\Eloquent\SoftDeletes;

class ParentInfo extends UuidModel
{
    use SoftDeletes;

    protected $table = 'parent_infos';

    const SEX = [
        'FEMALE' => 0,
        'MALE' => 1,
        'OTHER' => 2,
    ];
    
    protected $fillable = [
        'full_name', 'birth_date', 'sex', 'email', 'phone', 'other_phone',
        'address', 'city_id', 'district_id', 'facebook', 'zalo', 'instagram',
        'skype', 'name_company', 'address_company', 'phone_company', 'career', 'status', 'file_image',
        'customer_lead_id', 'admission_register_id'
    ];

    public function admissionRegister()
    {
        return $this->belongsTo(AdmissionRegister::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }
}
