<?php

namespace GGPHP\Core\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class SendNotiWithoutCode
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
        $urlNoti = env('NOTI_URL') . '/api/notification/publish';
        
        if (!empty($data['users'])) {
            Http::withToken(request()->bearerToken())->post($urlNoti, [
                'users' => $data['users'],
                'title' => $data['title'],
                'imageURL' => $data['imageURL'],
                'message' => $data['message'],
                'moduleType' => $data['moduleType'],
                'refId' => $data['refId'],
            ]);
        }
    }
}
