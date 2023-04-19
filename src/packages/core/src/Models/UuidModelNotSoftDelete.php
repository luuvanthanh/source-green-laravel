<?php
namespace GGPHP\Core\Models;

use GGPHP\Core\Models\CoreModelNotSoftDelete;
use Webpatser\Uuid\Uuid;

class UuidModelNotSoftDelete extends CoreModelNotSoftDelete
{
    public $keyType = 'string';
    protected $primaryKey = 'Id';

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->{$model->getKeyName()} = Uuid::generate(4)->string;
        });
    }

    public static function create($attributes = [])
    {
        foreach ($attributes as $key => $value) {
            $newkey = dashesToCamelCase($key, true);

            if ($key != $newkey) {
                $attributes[$newkey] = $attributes[$key];
                unset($attributes[$key]);
            }
        }

        return static::query()->create($attributes);
    }

    public function update(array $attributes = [], array $options = [])
    {
        foreach ($attributes as $key => $value) {
            $newkey = dashesToCamelCase($key, true);

            if ($key != $newkey) {
                $attributes[$newkey] = $attributes[$key];
                unset($attributes[$key]);
            }
        }

        return parent::update($attributes, $options);
    }
}
