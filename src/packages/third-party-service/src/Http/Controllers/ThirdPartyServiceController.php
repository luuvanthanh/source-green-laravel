<?php

namespace GGPHP\ThirdPartyService\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\ThirdPartyService\Http\Requests\ThirdPartyServiceCreateRequest;
use GGPHP\ThirdPartyService\Http\Requests\ThirdPartyServiceUpdateRequest;
use GGPHP\ThirdPartyService\Repositories\Contracts\ThirdPartyServiceRepository;
use GGPHP\ThirdPartyService\Models\ThirdPartyService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ThirdPartyServiceController extends Controller
{
    /**
     * @var $thirdPartyServicerRepository
     */
    protected $thirdPartyServicerRepository;

    /**
     * ThirdPartyServiceController constructor.
     * @param ThirdPartyServiceRepository $ThirdPartyServiceRepository
     */
    public function __construct(ThirdPartyServiceRepository $thirdPartyServiceRepository)
    {
        $this->thirdPartyServiceRepository = $thirdPartyServiceRepository;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $thirdPartyServices = $this->thirdPartyServiceRepository->getThirdPartyServices($request->all());

        return $this->success($thirdPartyServices, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * @param Request $request
     * @param  ThirdPartyService $thirdPartyService
     * @return Response
     */
    public function show(Request $request, ThirdPartyService $thirdPartyService)
    {
        $thirdPartyService = $this->thirdPartyServiceRepository->parserResult($thirdPartyService);

        return $this->success($thirdPartyService, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     *
     * @param ThirdPartyServiceCreateRequest $request
     *
     * @return Response
     */
    public function store(ThirdPartyServiceCreateRequest $request)
    {

        $attributes = $request->all();

        $thirdPartyServices = $this->thirdPartyServiceRepository->create($attributes);

        return $this->success($thirdPartyServices, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     *
     * @param ThirdPartyServiceUpdateRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(ThirdPartyServiceUpdateRequest $request, $id)
    {
        $attributes = $request->all();

        $thirdPartyService =  $this->thirdPartyServiceRepository->update($attributes, $id);

        return $this->success($thirdPartyService, trans('lang::messages.common.modifySuccess'));
    }

    /**
     *
     * @param ThirdPartyService $thirdPartyService
     *
     * @return Response
     */
    public function destroy($id)
    {
        if ($this->thirdPartyServiceRepository->delete($id)) {
            return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
        }

        return response()->json(null, Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
