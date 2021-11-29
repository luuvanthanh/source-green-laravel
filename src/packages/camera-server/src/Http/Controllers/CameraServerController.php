<?php

namespace GGPHP\CameraServer\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\CameraServer\Http\Requests\CameraServerCreateRequest;
use GGPHP\CameraServer\Http\Requests\CameraServerUpdateRequest;
use GGPHP\CameraServer\Models\CameraServer;
use GGPHP\CameraServer\Repositories\Contracts\CameraServerRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class CameraServerController extends Controller
{
    /**
     * @var $cameraServerRepository
     */
    protected $cameraServerRepository;

    /**
     * CameraServerController constructor.
     * @param CameraServerRepository $cameraServerRepository
     */
    public function __construct(CameraServerRepository $cameraServerRepository)
    {
        $this->cameraServerRepository = $cameraServerRepository;
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
                $newStatus[] = Order::STATUS[$value];
            }

            $attributes['status'] = array_values($newStatus);
        }

        $cameraServers = $this->cameraServerRepository->getCameraServers($attributes);

        return $this->success($cameraServers, trans('lang::messages.common.getListSuccess'));
    }

    /**
     *
     * @param CameraServerCreateRequest $request
     *
     * @return Response
     */
    public function store(CameraServerCreateRequest $request)
    {
        $credentials = $request->all();

        $cameraServer = $this->cameraServerRepository->create($credentials);

        return $this->success($cameraServer, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Create uuid
     *
     * @return void
     */
    public function uuid()
    {
        $uuid = (string) Str::uuid();
        $response = [
            'status' => Response::HTTP_CREATED,
            'message' => trans('lang::messages.common.createSuccess'),
            'uuid' => $uuid
        ];

        return response()->json($response, Response::HTTP_CREATED);
    }

    public function transferCamera(Request $request, $id)
    {
        $cameraServer = $this->cameraServerRepository->transferCamera($request->all(), $id);

        return $this->success($cameraServer, trans('lang::messages.common.createSuccess'));
    }

    public function changeStatus(Request $request, $id)
    {
        $attributes = $request->all();

        if (!empty($attributes['status'])) {
            $attributes['status'] = CameraServer::STATUS[$attributes['status']];
        }

        $cameraServer = $this->cameraServerRepository->changeStatus($attributes, $id);

        return $this->success($cameraServer, trans('lang::messages.common.createSuccess'));
    }
}
