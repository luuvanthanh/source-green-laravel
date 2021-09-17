<?php

namespace GGPHP\Core\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class SendNoti
{
    use Dispatchable, InteractsWithQueue, SerializesModels;

    protected $data;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $data = $this->data;
        $moduleCode = $data['moduleCode'];
        $urlNoti = env('NOTI_URL') . '/api/notification/publish-by-module-code?moduleCode='. $moduleCode;


        if (!empty($data['users'])) {
            $bearerToken = request()->bearerToken();

            Http::withToken("$bearerToken")->post("$urlNoti", [
                'users' => $data['users'],
                'title' => $data['title'],
                'imageURL' => $data['imageURL'],
                'message' =>$data['message'],
                'moduleType' => $data['moduleType'],
                'refId' => $data['refId'],
            ]);
        }
    }
}
