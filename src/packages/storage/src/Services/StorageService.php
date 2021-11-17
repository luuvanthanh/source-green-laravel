<?php
namespace GGPHP\Storage\Services;

class StorageService
{
    /**
     * @param $attributes
     * @return bool
     */
    public static function upload($request, $dir)
    {
        $path = '';
        $paths = [];
        $files = $request->file('file') ?? $request->file('files');
        if (is_array($files)) {
            foreach ($files as $file) {
                $paths[] = $file->store($dir);
            }
        } else {
            $path = $files->store($dir);
        }

        return compact('path', 'paths');
    }

    /**
     * @param $attributes
     * @return bool
     */
    public static function remove($path, $disk = 'minio')
    {
        return \Storage::disk($disk)->delete($path);
    }
}
