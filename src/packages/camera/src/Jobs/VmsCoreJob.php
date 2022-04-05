<?php

namespace GGPHP\Camera\Jobs;

use GGPHP\Camera\Services\VmsCoreServices;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Mail;
use Spatie\MailTemplates\Models\MailTemplate;

class VmsCoreJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $data;
    protected $type;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($data, $type)
    {
        $this->data = $data;
        $this->type = $type;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        switch ($this->type) {
            case 'CREATE_CAMERA':
                VmsCoreServices::startCamera($this->data);
                break;
            case 'UPDATE_CAMERA':
                VmsCoreServices::updateCamera($this->data);
                break;
            case 'DELETE_CAMERA':
                VmsCoreServices::stopCamera($this->data);
                break;

            default:
                # code...
                break;
        }
    }
}
