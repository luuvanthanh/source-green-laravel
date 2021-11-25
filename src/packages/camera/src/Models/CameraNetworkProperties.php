<?php

namespace GGPHP\Camera\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Support\Facades\Redis;

class CameraNetworkProperties extends UuidModel
{
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id', 'camera_id', 'ipv4_addr', 'ipv4_subnetmask', 'ipv4_gateway', 'ipv6_addr', 'ipv6_subnetmask', 'ipv6_gateway', 'dns_server_primary', 'dns_server_secondary'
    ];

    protected $guard_name = 'api';

    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateTimeFormat = 'c';
}
