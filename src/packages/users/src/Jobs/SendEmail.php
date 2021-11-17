<?php

namespace GGPHP\Users\Jobs;

use GGPHP\Users\Mail\NotificationPassword;
use GGPHP\Users\Mail\ResetPassword;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Mail;

class SendEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $data;
    protected $event;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(array $data, $event)
    {
        $this->data = $data;
        $this->event = $event;

    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        switch ($this->event) {
            case 'FORGOT_PASSWORD':
                $mail = new ResetPassword($this->data);
                break;
            case 'NOTI_PASSWORD':
                $mail = new NotificationPassword($this->data);
                break;
        }

        Mail::to($this->data['email'])->send($mail);

        if (Mail::failures()) {
            dispatch(new SendEmail($this->data, Mail::failures(), $this->event))->delay(10);
        }
    }
}
