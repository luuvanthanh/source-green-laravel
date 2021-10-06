<?php

namespace GGPHP\Crm\Marketing\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Category\Models\SearchSource;
use GGPHP\Crm\Province\Models\City;
use GGPHP\Crm\Province\Models\District;
use Illuminate\Database\Eloquent\SoftDeletes;

class DataMarketing extends UuidModel
{
    use SoftDeletes;

    protected $table = 'data_marketings';

    const SEX = [
        'FEMALE' => 0,
        'MALE' => 1,
        'OTHER' => 2,
    ];

    const STATUS = [
        'MOVE' => 0,
        'NOT_MOVE' => 1
    ];

    const CODE = 'PH';

    protected $fillable = [
        'code', 'full_name', 'birth_date', 'sex', 'email', 'phone', 'other_phone',
        'address', 'city_id', 'district_id', 'facility_id', 'user_create_id', 'user_create_info', 'search_source_id',
        'facebook', 'zalo', 'instagram', 'skype', 'name_company', 'address_company',
        'phone_company', 'career', 'file_image', 'status'
    ];

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

    public function marketingProgram()
    {
        return $this->belongsToMany(MarketingProgram::class, 'data_marketing_program', 'data_marketing_id', 'marketing_program_id');
    }
}
