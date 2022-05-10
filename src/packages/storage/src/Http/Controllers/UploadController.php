<?php

namespace GGPHP\Storage\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Storage\Http\Requests\DeleteFileRequest;
use GGPHP\Storage\Http\Requests\UploadRequest;
use GGPHP\Storage\Services\StorageService;
use GGPHP\TourGuide\Models\TourGuide;
use Illuminate\Http\Request;
use Spatie\MediaLibrary\MediaCollections\Exceptions\UnreachableUrl;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class UploadController extends Controller
{
    /**
     * Upload single or multiple files.
     *
     * @return \Illuminate\Http\Response
     */
    public function upload(UploadRequest $request)
    {
        $paths = StorageService::upload($request, config('filesystems.pathToUpload'));

        return $this->success($paths);
    }

    /**
     * Upload single or multiple files.
     *
     * @return \Illuminate\Http\Response
     */
    public function download()
    {
        $path = request()->path;
        return \Storage::disk('minio')->download($path);
    }

    /**
     * Destroy a file.
     *
     * @return \Illuminate\Http\Response
     */
    public function delete(DeleteFileRequest $request)
    {
        StorageService::remove($request->path, config('filesystems.default'));

        return response()->json([], 204);
    }
}
