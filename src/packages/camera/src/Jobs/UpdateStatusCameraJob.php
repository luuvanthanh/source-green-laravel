<?php

namespace GGPHP\Camera\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use GGPHP\Camera\Models\Camera;
use Illuminate\Http\Response;
use GGPHP\Camera\Events\CameraUpdateStatus;

class UpdateStatusCameraJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $camera;

    protected $status;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Camera $camera, $status)
    {
        $this->camera = $camera;
        $this->status = $status;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            broadcast(new CameraUpdateStatus([
                'id'     => $this->camera->id,
                'status' => $this->status
            ]));

            \Log::info('Camera '. $this->camera->id. ' update status successfully');
        } catch (\Exception $e) {
            \Log::error('Camera '. $this->camera->id. ' update status fail');
            \Log::error($e);
        }
    }
}
