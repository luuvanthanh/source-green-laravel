<?php

namespace ZK\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncUserToDevice implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $employee;
    public $devices;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($employee, $devices)
    {
        $this->employee = $employee;
        $this->devices = $devices;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            foreach ($this->devices as $device) {
                $zk = new \ZK\Driver\ZKLib($device->ip, $device->port);
                //connect to device
                $zk->connect();
                //set employee from server to device
                $zk->setUser($this->employee->Id, $this->employee->Id, $this->employee->FullName, '', \ZK\Driver\Util::LEVEL_USER);
                //disconnect
                $zk->disconnect();
            }
        } catch (\Exception $e) {
            \Log::info($e);
        }
    }
}
