<?php

namespace GGPHP\Core\Models;

use GGPHP\Core\Contracts\Presentable;
use GGPHP\Core\Traits\BootPresentTrait;
use GGPHP\Core\Traits\CastDatetimeFormatTrait;
use Illuminate\Database\Eloquent\Model;

class CoreModel extends Model implements Presentable
{
    const CREATED_AT = 'CreationTime';
    const UPDATED_AT = 'LastModificationTime';
    const DELETED_AT = 'DeletedAt';

    use CastDatetimeFormatTrait, BootPresentTrait;
}
