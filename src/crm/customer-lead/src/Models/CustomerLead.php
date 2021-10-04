<?php

namespace GGPHP\Crm\CustomerLead\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Category\Models\SearchSource;
use GGPHP\Crm\Province\Models\City;
use GGPHP\Crm\Province\Models\District;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerLead extends UuidModel
{
    use SoftDeletes;

    protected $table = 'customer_leads';

    const SEX = [
        'FEMALE' => 0,
        'MALE' => 1,
        'OTHER' => 2,
    ];

    const CODE = 'PH';

    protected $fillable = [
        'code' ,'full_name', 'birth_date', 'sex', 'email', 'phone', 'other_phone',
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

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function searchSource()
    {
        return $this->belongsTo(SearchSource::class);
    }

    public function statusCare()
    {
        return $this->hasMany(StatusCare::class);
    }
}
