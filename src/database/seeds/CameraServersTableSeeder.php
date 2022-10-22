<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CameraServersTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('camera_servers')->delete();
        
        \DB::table('camera_servers')->insert(array (
            0 => 
            array (
                'id' => '4f94c8c4-20f1-4f40-bf33-30f0b5deb589',
                'ipv4' => '192.168.111.30:7001',
                'ipv6' => 'fe80::292c:c593:dd1e:5443/64',
                'nas_folder' => NULL,
                'status' => '2',
                'user_id' => '3ac43330-535d-4079-bbc1-767b3c91fe00',
                'created_at' => '2022-09-15 21:29:16',
                'updated_at' => '2022-09-16 13:16:25',
                'deleted_at' => NULL,
                'uuid' => '8d910b86-b26d-4ebd-9aab-aa8a859d6acb',
                'root_path_bk' => '/mnt/nfsclient_share_backup/ai02_backup/vms_data/back_videos',
                'second_interval_bk' => '60',
                'media_server_url' => 'rtmp://192.168.111.20/live',
                'clip_root_path' => '/mnt/nfsclient_share_backup/ai02_backup/vms_data/video_clips',
                'log_root_path' => '/mnt/nfsclient_share_backup/ai02_backup/vms_data/logging_files',
                'log_level' => '24',
                'backup_video_day_passed' => 2,
                'clip_video_day_passed' => 2,
                'loggings_day_passed' => 2,
                'server_name' => 'ai2',
                'vms_url' => 'http://192.168.111.30:7001',
                'ai_service_url' => 'http://192.168.111.30:7003',
            ),
            1 => 
            array (
                'id' => '03104434-969c-407a-864a-78a8dead7284',
                'ipv4' => '192.168.111.20:7001',
                'ipv6' => 'fe80::292c:c593:dd1e:5443/64',
                'nas_folder' => NULL,
                'status' => '2',
                'user_id' => NULL,
                'created_at' => '2022-09-15 21:29:47',
                'updated_at' => '2022-09-16 13:17:04',
                'deleted_at' => NULL,
                'uuid' => '89a9319b-9e62-430d-8ca0-6431ed692dc3',
                'root_path_bk' => '/mnt/nfsclient_share_backup/ai01_backup/vms_data/back_videos',
                'second_interval_bk' => '60',
                'media_server_url' => 'rtmp://192.168.111.20/live',
                'clip_root_path' => '/mnt/nfsclient_share_backup/ai01_backup/vms_data/video_clips',
                'log_root_path' => '/mnt/nfsclient_share_backup/ai01_backup/vms_data/logging_files',
                'log_level' => '24',
                'backup_video_day_passed' => 2,
                'clip_video_day_passed' => 2,
                'loggings_day_passed' => 2,
                'server_name' => 'ai1',
                'vms_url' => 'http://192.168.111.20:7001',
                'ai_service_url' => 'http://192.168.111.20:7003',
            ),
        ));
        
        
    }
}