<?php

namespace GGPHP\Users\Mail;

use Illuminate\Mail\Mailable;

class ResetPassword extends Mailable
{

    /**
     * Data
     *
     * @var string
     */
    public $data;

    /**
     * Create a new message instance.
     *
     * @param $data
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'))
            ->subject(trans('lang-user::messages.email.reset'))
            ->view('ggphp-users::emails.forgot_password');
    }
}
