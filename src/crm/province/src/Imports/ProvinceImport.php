<?php

namespace GGPHP\Crm\Province\Imports;

use GGPHP\Crm\Province\Models\City;
use GGPHP\Crm\Province\Models\District;
use GGPHP\Crm\Province\Models\TownWard;
use Maatwebsite\Excel\Concerns\ToModel;
use Webpatser\Uuid\Uuid;

class ProvinceImport implements ToModel
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        if (!is_null($row[0]) && !is_null($row[1]) && !is_null($row[2])) {

            $city = City::updateOrCreate(["name" => trim($row[0])], [
                "name" => trim($row[0]),
            ]);

            $district = District::updateOrCreate(
                [
                    "name" => trim($row[1]),
                    "city_province_id" => $city->id
                ],
                [
                    "name" => trim($row[1]),
                    "city_province_id" =>  $city->id
                ]
            );

            $townWard = TownWard::updateOrCreate(
                [
                    "name" => trim($row[2]),
                    "district_id" => $district->id
                ],
                [
                    "name" => trim($row[2]),
                    "district_id" =>  $district->id
                ]
            );
        }

        return;
    }
}
