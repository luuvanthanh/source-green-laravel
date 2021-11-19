<?php

namespace GGPHP\Core\Models;

use GGPHP\Core\Models\CoreModel;
use Webpatser\Uuid\Uuid;

class UuidModel extends CoreModel
{
    public $keyType = 'string';
    public $incrementing = false;

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->{$model->getKeyName()} = Uuid::generate(4)->string;
        });
    }

    /**
     * Cancel Fault.
     *
     * @param object $entity
     * @param array $images
     * @param string $collection
     */
    public function addMediaToEntity($entity, $images = [], $collection = 'files')
    {
        foreach ($images as $image_path) {
            $entity->addMediaFromDisk($image_path['path'])->usingName($image_path['file_name'])->preservingOriginal()->toMediaCollection($collection);
        }
    }
}
