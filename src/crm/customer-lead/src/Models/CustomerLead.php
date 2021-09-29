<?php

namespace GGPHP\Crm\CustomerLead\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerLead extends UuidModel
{
    use SoftDeletes;

    protected $table = 'customer_leads';

    protected $fillable = [
        'full_name', 'birth_date', 'sex', 'email', 'phone', 'other_phone',
        'address', 'city_id', 'district_id', 'facility_id', 'employee_id',
        'employee_info', 'user_create_id', 'user_create_info', 'search_source_id',
        'facebook', 'zalo', 'instagram', 'skype', 'name_company', 'address_company',
        'phone_company', 'career', 'file_image'
    ];

    public function reference()
    {
        return $this->hasOne(Reference::class);
    }

    public function eventInfo()
    {
        return $this->hasMany(EventInfo::class);
    }

    public function customerTag()
    {
        return $this->hasMany(CustomerTag::class);
    }

    public function studentInfo()
    {
        return $this->hasMany(StudentInfo::class);
    }
}
