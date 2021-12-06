<?php

namespace GGPHP\Storage\Services;

use Illuminate\Support\Facades\Http;

class StorageService
{
    /**
     * @param $attributes
     * @return bool
     */
    public static function upload($request, $dir, $isVector = false)
    {
        $path = '';
        $paths = [];
        $vector = null;
        $files = $request->file('file') ?? $request->file('files');
        if (is_array($files)) {
            foreach ($files as $file) {
                $paths[] = $file->store($dir);
            }
        } else {

            if ($isVector) {
                $response = Http::attach('image', file_get_contents($files), 'image.jpg')
                    ->post(env('AI_URL') . "/face_service/get_face_vector", []);
                if ($response->successful()) {
                    $respone = json_decode($response->body());
                    $vector = json_encode($respone->vector[0]);
                }
            }

            $path = $files->store($dir);
        }

        $data = [
            'path' => $path,
            'vector' => $vector
        ];

        return $data;
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
