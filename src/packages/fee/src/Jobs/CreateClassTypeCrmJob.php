<?php

namespace GGPHP\Fee\Jobs;

use GGPHP\Fee\Services\ClassTypeCrmService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CreateClassTypeCrmJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $classType;
    protected $token;

    public function __construct($classType, $token)
    {
        $this->token = $token;
        $this->classType = $classType;
    }

    public function handle()
    {
        ClassTypeCrmService::create($this->classType, $this->token);
    }
}
