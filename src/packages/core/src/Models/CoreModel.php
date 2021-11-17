<?php

namespace GGPHP\Core\Models;

use Illuminate\Database\Eloquent\Model;
use Prettus\Repository\Contracts\Presentable;
use Prettus\Repository\Traits\PresentableTrait;
use GGPHP\Core\Traits\CastDatetimeFormatTrait;


class CoreModel extends Model implements Presentable
{
    use PresentableTrait, CastDatetimeFormatTrait;

    protected static $logFillable = true;
}
