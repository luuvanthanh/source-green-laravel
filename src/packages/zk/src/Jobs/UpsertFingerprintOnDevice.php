<?php

namespace ZK\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpsertFingerprintOnDevice implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $uid;
    public $devices;
    public $fingerprint;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($uid, $fingerprints, $devices)
    {
        $this->uid = $uid;
        $this->fingerprints = $fingerprints;
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
                //set user from server to device
                $zk->setFingerprint($this->uid, $this->fingerprints);
                //disconnect
                $zk->disconnect();
            }
        } catch (\Exception $e) {
            \Log::info($e);
        }
    }
}
