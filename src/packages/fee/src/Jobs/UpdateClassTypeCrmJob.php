<?php

namespace GGPHP\Fee\Jobs;

use GGPHP\Fee\Services\ClassTypeCrmService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdateClassTypeCrmJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $classType;
    protected $token;
    protected $classTypeId;
    
    public function __construct($classType, $classTypeId, $token)
    {
        $this->token = $token;
        $this->classType = $classType;
        $this->classTypeId = $classTypeId;
    }

    public function handle()
    {
        ClassTypeCrmService::update($this->classType, $this->classTypeId, $this->token);
    }
}
