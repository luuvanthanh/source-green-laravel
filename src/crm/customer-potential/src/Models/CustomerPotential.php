<?php

namespace GGPHP\Crm\CustomerPotential\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use GGPHP\Crm\Province\Models\City;
use GGPHP\Crm\Province\Models\District;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerPotential extends UuidModel
{
    use SoftDeletes;

    protected $table = 'customer_potentials';

    const SEX = [
        'FEMALE' => 0,
        'MALE' => 1,
        'OTHER' => 2,
    ];

    const CODE = 'TN';

    protected $fillable = [
        'code', 'full_name', 'birth_date', 'sex', 'email', 'phone', 'other_phone',
        'address', 'city_id', 'district_id', 'facility_id', 'employee_id',
        'employee_info', 'user_create_id', 'user_create_info', 'search_source_id',
        'facebook', 'zalo', 'instagram', 'skype', 'name_company', 'address_company',
        'phone_company', 'career', 'file_image', 'customer_lead_id'
    ];

    public function customerLead()
    {
        return $this->belongsTo(CustomerLead::class);
    }

    public function potentialStudentInfo()
    {
        return $this->hasMany(PotentialStudentInfo::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function customerPotentialTag()
    {
        return $this->hasMany(CustomerPotentialTag::class);
    }
}
