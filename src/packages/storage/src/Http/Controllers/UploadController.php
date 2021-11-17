<?php

namespace GGPHP\Storage\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Storage\Http\Requests\DeleteFileRequest;
use GGPHP\Storage\Http\Requests\UploadRequest;
use GGPHP\Storage\Services\StorageService;

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
