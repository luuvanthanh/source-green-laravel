<?php

namespace GGPHP\Event\Email;

use GGPHP\Event\Models\Event;
use GGPHP\Users\Models\User;
use Spatie\MailTemplates\TemplateMailable;

class EventCreate extends TemplateMailable
{
    /** @var string */
    public $tendoituong;
    public $tennguoidung;
    public $duongdan;
    public $tenkhudiem;

    public function __construct(Event $event, User $user)
    {
        $this->tendoituong = $event->tourGuide ? $event->tourGuide->name : null;
        $this->tennguoidung =  $user->full_name;
        $this->duongdan =   env('WEB_APP_URL') . '/su-kien' . '/' . $event->id;
        $this->tenkhudiem = $event->touristDestination->name;
    }

    public function getHtmlLayout(): string
    {
        /**
         * In your application you might want to fetch the layout from an external file or Blade view.
         *
         * External file: `return file_get_contents(storage_path('mail-layouts/main.html'));`
         *
         * Blade view: `return view('mailLayouts.main', $data)->render();`
         */

        return '{{{ body }}}';
    }
}
