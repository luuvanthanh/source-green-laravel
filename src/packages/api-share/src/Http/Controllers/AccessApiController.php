<?php

namespace GGPHP\ApiShare\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\ApiShare\Repositories\Contracts\AccessApiRepository;
use GGPHP\ApiShare\Models\ApiShare;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AccessApiController extends Controller
{
    /**
     * @var $accessApiRepository
     */
    protected $accessApiRepository;

    /**
     * AccessApiController constructor.
     * @param AccessApiRepository $accessApiRepository
     */
    public function __construct(AccessApiRepository $accessApiRepository)
    {
        $this->accessApiRepository = $accessApiRepository;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $accessApis = $this->accessApiRepository->getAccessApis($request->all());

        return $this->success($accessApis, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * @param Request $request
     * @param  ApiShare $accessApi
     * @return Response
     */
    public function show(Request $request, ApiShare $accessApi)
    {
        $accessApi = $this->accessApiRepository->parserResult($accessApi);

        return $this->success($accessApi, trans('lang::messages.common.getInfoSuccess'));
    }
}
