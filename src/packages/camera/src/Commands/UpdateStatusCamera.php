<?php

namespace GGPHP\Camera\Commands;

use GGPHP\Camera\Models\Camera;
use Illuminate\Console\Command;
use Illuminate\Http\Response;
use GGPHP\Camera\Events\CameraUpdateStatus;
use GGPHP\Camera\Http\Controllers\CameraPtzController;
use GGPHP\Camera\Jobs\UpdateStatusCameraJob;

class UpdateStatusCamera extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'camera:update-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update status camera';

    protected $cameraPtz;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(CameraPtzController $cameraPtz)
    {
        parent::__construct();
        $this->cameraPtz = $cameraPtz;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $cameras = Camera::all();

        foreach ($cameras as $key => $camera) {
            $info = $this->cameraPtz->getInfoDevice($camera);

            if (empty($info)) {
                $status = Camera::STATUS_FAILED;
            } else {
                $status = !empty($info['status']) && $info['status'] == Response::HTTP_OK ? Camera::STATUS_RUNNING : Camera::STATUS_FAILED;
            }

            if ($camera->status != $status) {
                $camera->update(['status' => $status]);
                dispatch(new UpdateStatusCameraJob($camera, $status));
            }
        }
    }
}
