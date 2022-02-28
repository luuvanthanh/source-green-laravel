<?php

namespace GGPHP\Event\Jobs;

use GGPHP\Event\Email\EventCreate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Mail;
use Spatie\MailTemplates\Models\MailTemplate;

class SendEmailEventCreate implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $event;
    protected $user;
    protected $teamplate;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($event, $user, $teamplate)
    {
        $this->event = $event;
        $this->user = $user;
        $this->teamplate = $teamplate;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $event = $this->event;
        $user = $this->user;
        $teamplateEmail = $this->teamplate;

        MailTemplate::create([
            'mailable' => EventCreate::class,
            'subject' => $teamplateEmail->title,
            'html_template' => $teamplateEmail->content
        ]);

        Mail::to($user->email)->send(new EventCreate($event, $user));

        if (Mail::failures()) {
            dispatch(new SendEmail($this->data, Mail::failures(), $event))->delay(10);
        }
    }
}
