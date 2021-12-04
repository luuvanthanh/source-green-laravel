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
            $fileName = isset($image_path['file_name']) ? $image_path['file_name'] : 'file_name';
            $vector = isset($image_path['vector']) ? $image_path['vector'] : null;
            $entity->addMediaFromDisk($image_path['path'])->usingName($fileName)
                ->withCustomProperties([
                    "vector" => $vector
                ])->preservingOriginal()->toMediaCollection($collection);
        }
    }
}
