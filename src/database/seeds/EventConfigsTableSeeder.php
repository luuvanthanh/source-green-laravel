<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class EventConfigsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('event_configs')->delete();
        
        \DB::table('event_configs')->insert(array (
            0 => 
            array (
                'id' => 'ea117c0d-a653-4431-817f-caaa04a2af48',
                'config_event' => '[{"event_type":"HDVHP","warning_level":"LOW"},{"event_type":"HDVBHP","warning_level":"LOW","appearing_from":5,"warning_level_by_appearing_from":"HIGH"},{"event_type":"NNHDV","warning_level":"LOW"},{"event_type":"BL","warning_level":"LOW","appearing_from":5,"warning_level_by_appearing_from":"HIGH"},{"event_type":"RAC","warning_level":"LOW","retention_time_from":10},{"event_type":"BHR","warning_level":"LOW"},{"event_type":"HVHD","warning_level":"LOW"}]',
                'config_count_tourist' => '{"start_time":"09:00","end_time":"09:00","guest_number_warning":5000,"is_apply_all":true,"detail":[{"tourist_destination_id":"cf25bd07-e1ca-4fa6-8250-145bf0bfb4c3","tourist_destination_name":"B\\u1ea3o t\\u00e0ng \\u0110\\u00e0 N\\u1eb5ng","start_time":"09:00","end_time":"15:00","guest_number_warning":5000},{"tourist_destination_id":"56f2032f-5512-4a4d-a77a-9e2cae4f96ff","tourist_destination_name":"Ch\\u00f9a Linh \\u1ee8ng","start_time":"08:00","end_time":"12:00","guest_number_warning":5000}]}',
                'created_at' => '2022-02-21 14:26:41',
                'updated_at' => '2022-02-21 14:26:41',
            ),
        ));
        
        
    }
}