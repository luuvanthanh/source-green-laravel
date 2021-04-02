<?php
namespace GGPHP\Core\Models;

use GGPHP\Core\Models\CoreModel;
use Webpatser\Uuid\Uuid;

class UuidModel extends CoreModel
{
    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->{$model->getKeyName()} = Uuid::generate(4)->string;
        });
    }

}
