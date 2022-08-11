<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class TouristDestinationsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('tourist_destinations')->delete();
        
        \DB::table('tourist_destinations')->insert(array (
            0 => 
            array (
                'id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'name' => 'Ngũ hành sơn',
                'address' => '81 Huyền Trân Công Chúa, Hoà Hải, Ngũ Hành Sơn, Đà Nẵng',
                'phone' => '0236 3961 114',
                'email' => 'bqldtnhs@danang.gov.vn',
                'website' => 'nguhanhson.org',
                'created_at' => '2021-11-26 14:57:28',
                'updated_at' => '2021-11-26 14:57:28',
                'deleted_at' => NULL,
            ),
            1 => 
            array (
                'id' => 'cf25bd07-e1ca-4fa6-8250-145bf0bfb4c3',
                'name' => 'Bảo tàng Đà Nẵng',
                'address' => '24 Trần Phú, Thạch Thang, Hải Châu, Đà Nẵng',
                'phone' => '02363886236',
                'email' => 'btdn@danang.gov.vn',
                'website' => 'baotangdanang.vn',
                'created_at' => '2021-11-26 14:58:18',
                'updated_at' => '2021-11-26 14:58:18',
                'deleted_at' => NULL,
            ),
        ));
        
        
    }
}