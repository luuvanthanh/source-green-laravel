<?php

namespace GGPHP\TravelAgency\Models;

use GGPHP\Core\Models\UuidModel;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class TravelAgency extends UuidModel implements HasMedia
{
    use InteractsWithMedia;

    /**
     * Declare the table name
     */
    protected $table = 'travel_agencies';

    const LOCALITY = [
        'HOANG_SA' => 0,
        'THANH_KHE' => 1,
        'HOA_VANG' => 2,
        'SON_TRA' => 3,
        'NGU_HANH_SON' => 4,
        'LIEN_CHIEU' => 5,
        'HAI_CHAU' => 6,
        'CAM_LE' => 7
    ];

    const SERVICE_TYPE = [
        'AUTHORIZED_DEALER' => 0,
        'REPRESENTATIVE_OFFICE' => 1,
        'INTERNATIONAL_TO_BRANCH' => 2,
        'INLAND_TO_BRANCH' => 3,
        'INLAND_TO' => 4,
        'INTERNATIONAL_TO' => 5
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'representative_name', 'representative_phone', 'english_name', 'number_of_seasonal_worker',
        'travel_permit', 'account_name', 'service_type', 'license_date', 'phone', 'status', 'operator_name',
        'operator_phone', 'address', 'license_number', 'email', 'date_range', 'reporter_name', 'reporter_phone',
        'fax', 'exploiting_international_visitor_market', 'website', 'number_of_regular_employee', 'total_number_of_registered_vehicle',
        'locality', 'tax_code', 'note'
    ];

    public function travelAgencyAdditionalInformation()
    {
        return $this->hasMany(\GGPHP\TravelAgency\Models\TravelAgencieTourGuide::class);
    }
}
