<?php

namespace GGPHP\Crm\AdmissionRegister\Services;

use GGPHP\Crm\AdmissionRegister\Models\ParentInfo;

class ParentInfoService
{
    public static function addParentInfo($id, $customerLead)
    {
        if (!is_null($customerLead)) {
            $dataCustomerLead = [
                'full_name' => $customerLead->full_name,
                'birth_date' => !empty($customerLead->birth_date) ? $customerLead->birth_date : null,
                'sex' => $customerLead->sex,
                'email' => $customerLead->email,
                'phone' => $customerLead->phone,
                'other_phone' => $customerLead->other_phone,
                'address' => $customerLead->address,
                'city_id' => $customerLead->city_id,
                'district_id' => $customerLead->district_id,
                'facebook' => $customerLead->facebook,
                'zalo' => $customerLead->zalo,
                'instagram' => $customerLead->instagram,
                'skype' => $customerLead->skype,
                'name_company' => $customerLead->name_company,
                'address_company' => $customerLead->address_company,
                'phone_company' => $customerLead->phone_company,
                'career' => $customerLead->career,
                'file_image' => $customerLead->file_image,
                'customer_lead_id' => $customerLead->id,
                'admission_register_id' => $id
            ];

            $parentInfo = ParentInfo::create($dataCustomerLead);
        }

        return $parentInfo;
    }
}
