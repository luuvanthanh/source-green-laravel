<?php

namespace GGPHP\Fee\Jobs;

use GGPHP\Fee\Services\FeeCrmService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CreateFeeCrmJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $fee;
    protected $token;

    public function __construct($fee, $token)
    {
        $this->token = $token;
        $this->fee = $fee;
    }

    public function handle()
    {
        FeeCrmService::create($this->fee, $this->token);
    }
}
