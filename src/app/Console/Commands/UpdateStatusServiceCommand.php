<?php

namespace App\Console\Commands;

use GGPHP\Camera\Models\CameraService;
use GGPHP\CameraServer\Models\CameraServer;
use GGPHP\TravelAgency\Repositories\Eloquent\TravelAgencyRepositoryEloquent;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class UpdateStatusServiceCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:update-status-ai-service';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update status ai service';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $cameraServer = CameraServer::where('status', CameraServer::STATUS['CONNECTION'])->get();

        foreach ($cameraServer as $key => $value) {
            $aiServiceUrl =  $value->ai_service_url;

            $url = $aiServiceUrl . '/ai_core/get_status_all_ai_service';

            $dataStartCamera = [
                'server_id' => $value->uuid,
            ];

            $response = Http::asForm()->post($url, $dataStartCamera);

            if ($response->failed()) {
                $message = 'Có lỗi từ api vms-core';
                if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                    $message = 'Vms-core: ' . json_decode($response->body())->error->message;
                }
                throw new HttpException(500, $message);
            }

            $data = json_decode($response->body(), true);

            if ($data['succ'] == true && !empty($data['list-status'])) {
                foreach ($data['list-status'] as $key => $serviceStatus) {

                    $cameraService = CameraService::where('camera_id', $serviceStatus['cam_id'])->whereHas('aiService', function ($query) use ($serviceStatus) {
                        $query->where('number', $serviceStatus['service_id']);
                    })->first();

                    if (!is_null($cameraService)) {
                        $cameraService->update([
                            'is_on' => $serviceStatus['running'],
                            'is_stream' => $serviceStatus['streaming_on'],
                        ]);
                    }
                }
            }
        }
    }
}
