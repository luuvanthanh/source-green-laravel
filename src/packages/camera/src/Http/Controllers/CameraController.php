<?php

namespace GGPHP\Camera\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Camera\Http\Requests\CameraCreateRequest;
use GGPHP\Camera\Http\Requests\CameraPlayBackRequest;
use GGPHP\Camera\Http\Requests\CameraUpdateRequest;
use GGPHP\Camera\Models\Camera;
use GGPHP\Camera\Repositories\Contracts\CameraRepository;
use GGPHP\Users\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class CameraController extends Controller
{
    /**
     * @var $cameraRepository
     */
    protected $cameraRepository;
    protected $cameraCollectionRepository;

    /**
     * CameraController constructor.
     * @param CameraRepository $cameraRepository
     */
    public function __construct(
        CameraRepository $cameraRepository
    ) {
        $this->cameraRepository = $cameraRepository;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['status'])) {
            $status = explode(',', $attributes['status']);
            $newStatus = [];
            foreach ($status as $value) {
                $newStatus[] = Camera::STATUS[$value];
            }

            $attributes['status'] = array_values($newStatus);
        }

        $cameras = $this->cameraRepository->getCamera($attributes);

        return $this->success($cameras, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function listing(Request $request)
    {
        $limit = null;
        if ($request->has('limit')) {
            $limit = $request->limit;
            $cameras = $this->cameraRepository->paginate($limit);
        } else {
            $cameras = $this->cameraRepository->getSimpleListing();
        }

        return $this->success($cameras, trans('lang::messages.common.getListSuccess'));
    }

    /**
     *
     * @param CameraCreateRequest $request
     *
     * @return Response
     */
    public function store(CameraCreateRequest $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['status'])) {
            $attributes['status'] = Camera::STATUS[$attributes['status']];
        }

        $camera = $this->cameraRepository->create($attributes);
        return $this->success($camera, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * @param Request $request
     * @param $id
     * @return Response
     */
    public function show(Request $request, $id)
    {
        $audio = $this->cameraRepository->find($id);
        return $this->success($audio, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     *
     * @param CameraUpdateRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(CameraUpdateRequest $request, $id)
    {
        $attributes = $request->all();

        if (!empty($attributes['status'])) {
            $attributes['status'] = Camera::STATUS[$attributes['status']];
        }

        $camera = $this->cameraRepository->update($attributes, $id);
        return $this->success($camera, trans('lang::messages.common.modifySuccess'));
    }

    /**
     *
     * @param  int $id
     *
     * @return Response
     */
    public function destroy($id)
    {
        if ($this->cameraRepository->delete($id)) {
            return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
        }

        return response()->json(null, 422);
    }

    public function onOffRecord(Request $request, $id)
    {
        $camera = $this->cameraRepository->onOffRecord($request->all(), $id);

        return $this->success($camera, trans('lang::messages.common.modifySuccess'));
    }

    public function onOffStream(Request $request, $id)
    {
        $camera = $this->cameraRepository->onOffStream($request->all(), $id);

        return $this->success($camera, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Play back
     *
     * @param  mixed $request
     * @param  mixed $camera
     * @return Response
     */
    public function playback(CameraPlayBackRequest $request, $id)
    {
        $camera = $this->cameraRepository->playback($request->all(), $id);

        return $this->success(['data' => $camera], trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Play back
     *
     * @param  mixed $request
     * @param  mixed $camera
     * @return Response
     */
    public function exportVideo(CameraPlayBackRequest $request, $id)
    {
        $camera = $this->cameraRepository->exportVideo($request->all(), $id);

        return $camera;
    }

    /**
     * Play back
     *
     * @param  mixed $request
     * @param  mixed $camera
     * @return Response
     */
    public function playbackStop(Request $request, $id)
    {
        $camera = $this->cameraRepository->playbackStop($request->all(), $id);

        return $this->success(['data' => $camera], trans('lang::messages.common.modifySuccess'));
    }

    /**
     * @param  mixed $request
     * @param  mixed $camera
     * @return Response
     */
    public function cameraChangeLog(Request $request)
    {
        $response = $this->cameraRepository->cameraChangeLog($request->all());

        return $this->success($response, trans('lang::messages.common.modifySuccess'));
    }

    public function updateCameraAiService(Request $request, $id)
    {
        $response = $this->cameraRepository->updateCameraAiService($request->all(), $id);

        return $this->success($response, trans('lang::messages.common.modifySuccess'));
    }

    public function onOffAiService(Request $request, $id)
    {
        $response = $this->cameraRepository->onOffAiService($request->all(), $id);

        return $this->success($response, trans('lang::messages.common.modifySuccess'));
    }
}
