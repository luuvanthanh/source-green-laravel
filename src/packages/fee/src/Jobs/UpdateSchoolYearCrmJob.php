<?php

namespace GGPHP\Fee\Jobs;

use GGPHP\Fee\Services\SchoolYearCrmService;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class UpdateSchoolYearCrmJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $schoolYear;
    protected $schoolYearId;
    protected $token;
    
    public function __construct($schoolYear, $schoolYearId, $token)
    {
        $this->schoolYear = $schoolYear;
        $this->schoolYearId = $schoolYearId;
        $this->token = $token;
    }

    public function handle()
    {
        SchoolYearCrmService::update($this->schoolYear, $this->schoolYearId, $this->token);
    }
}
