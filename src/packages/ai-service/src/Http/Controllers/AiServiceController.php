<?php

namespace GGPHP\AiService\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\AiService\Http\Requests\AiServiceCreateRequest;
use GGPHP\AiService\Http\Requests\AiServiceUpdateRequest;
use GGPHP\AiService\Models\AiService;
use GGPHP\AiService\Repositories\Contracts\AiServiceRepository;
use GGPHP\Camera\Models\CameraService;
use GGPHP\CameraServer\Models\CameraServer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;

class AiServiceController extends Controller
{
    /**
     * @var $aiServicerRepository
     */
    protected $aiServicerRepository;

    /**
     * AiServiceController constructor.
     * @param AiServiceRepository $AiServiceRepository
     */
    public function __construct(AiServiceRepository $aiServiceRepository)
    {
        $this->aiServiceRepository = $aiServiceRepository;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $aiServices = $this->aiServiceRepository->getAiServices($request->all());

        return $this->success($aiServices, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * @param Request $request
     * @param  AiService $aiService
     * @return Response
     */
    public function show(Request $request, AiService $aiService)
    {
        $aiService = $this->aiServiceRepository->parserResult($aiService);

        return $this->success($aiService, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     *
     * @param AiServiceCreateRequest $request
     *
     * @return Response
     */
    public function store(AiServiceCreateRequest $request)
    {

        $attributes = $request->all();

        $aiServices = $this->aiServiceRepository->create($attributes);

        return $this->success($aiServices, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     *
     * @param AiServiceUpdateRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(AiServiceUpdateRequest $request, AiService $aiService)
    {
        $attributes = $request->all();

        $aiService =  $this->aiServiceRepository->update($attributes, $aiService);

        return $this->success($aiService, trans('lang::messages.common.modifySuccess'));
    }

    /**
     *
     * @param AiService $aiService
     *
     * @return Response
     */
    public function destroy($id)
    {
        if ($this->aiServiceRepository->delete($id)) {
            return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
        }

        return response()->json(null, Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     *
     * @param AiService $aiService
     *
     * @return Response
     */
    public function checkAiService()
    {
        $cameraServer = CameraServer::where('status', CameraServer::STATUS['CONNECTION'])->get();

        foreach ($cameraServer as $key => $value) {
            $aiServiceUrl =  $value->ai_service_url;

            $url = $aiServiceUrl . '/ai_core/get_status_all_ai_service';

            $dataStartCamera = [
                'server_id' => $value->uuid,
            ];

            $response = Http::asForm()->post($url, $dataStartCamera);

            if ($response->failed()) {
                $message = 'Có lỗi từ api vms-core';
                if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                    $message = 'Vms-core: ' . json_decode($response->body())->error->message;
                }
                throw new HttpException(500, $message);
            }

            $data = json_decode($response->body(), true);

            if ($data['succ'] == true && !empty($data['list-status'])) {
                foreach ($data['list-status'] as $key => $serviceStatus) {

                    $cameraService = CameraService::where('camera_id', $serviceStatus['cam_id'])->whereHas('aiService', function ($query) use ($serviceStatus) {
                        $query->where('number', $serviceStatus['service_id']);
                    })->first();

                    if (!is_null($cameraService)) {
                        $cameraService->update([
                            'is_on' => $serviceStatus['running'],
                            'is_stream' => $serviceStatus['streaming_on'],
                        ]);
                    }
                }
            }
        }

        return response()->json(null, Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
