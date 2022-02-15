<?php

namespace GGPHP\Fee\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use GGPHP\Fee\Services\SchoolYearCrmService;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CreateSchoolYearCrmJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $schoolYear;
    protected $token;
    
    public function __construct($schoolYear, $token)
    {
        $this->token = $token;
        $this->schoolYear = $schoolYear;
    }

    public function handle()
    {
        SchoolYearCrmService::create($this->schoolYear, $this->token);
    }
}
