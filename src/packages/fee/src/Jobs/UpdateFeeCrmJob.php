<?php

namespace GGPHP\Fee\Jobs;

use GGPHP\Fee\Services\FeeCrmService;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class UpdateFeeCrmJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $fee;
    protected $feeCrmId;
    protected $token;

    public function __construct($fee, $feeCrmId, $token)
    {
        $this->fee = $fee;
        $this->feeCrmId = $feeCrmId;
        $this->token = $token;
    }

    public function handle()
    {
        FeeCrmService::update($this->fee, $this->feeCrmId, $this->token);
    }
}
