<?php

namespace ZK\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DeleteFingerprintOnDevice implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $devices;
    public $fingerprint;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($fingerprint, $devices)
    {
        $this->fingerprint = $fingerprint;
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
                $zk->removeFingerprint($this->fingerprint->employee_id, [$this->fingerprint->finger_index]);
                //disconnect
                $zk->disconnect();
            }
        } catch (\Exception $e) {
            \Log::info($e);
        }
    }
}
