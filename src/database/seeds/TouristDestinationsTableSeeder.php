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
                'address_limit' => NULL,
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
                'address_limit' => NULL,
            ),
            2 => 
            array (
                'id' => 'f5ace8a7-707a-459e-a91c-1a9d1495f090',
                'name' => 'Chùa Linh Ứng',
                'address' => NULL,
                'phone' => NULL,
                'email' => NULL,
                'website' => NULL,
                'created_at' => '2022-09-16 19:48:34',
                'updated_at' => '2022-09-16 19:48:34',
                'deleted_at' => NULL,
                'address_limit' => '"[{\\"lat\\":16.10282725411185,\\"long\\":108.27510237693788},{\\"lat\\":16.099042847814363,\\"long\\":108.27494144439697},{\\"lat\\":16.099661556774837,\\"long\\":108.2819151878357},{\\"lat\\":16.10306442158613,\\"long\\":108.28060626983644}]"',
            ),
        ));
        
        
    }
}