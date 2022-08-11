<?php

namespace GGPHP\AiService\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\AiService\Http\Requests\AiServiceCreateRequest;
use GGPHP\AiService\Http\Requests\AiServiceUpdateRequest;
use GGPHP\AiService\Repositories\Contracts\AiServiceRepository;
use GGPHP\AiService\Models\AiService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

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
}
