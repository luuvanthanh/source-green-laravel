<?php

namespace GGPHP\ApiShare\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\ApiShare\Http\Requests\ApiShareCreateRequest;
use GGPHP\ApiShare\Http\Requests\ApiShareUpdateRequest;
use GGPHP\ApiShare\Repositories\Contracts\ApiShareRepository;
use GGPHP\ApiShare\Models\ApiShare;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ApiShareController extends Controller
{
    /**
     * @var $apiSharerRepository
     */
    protected $apiSharerRepository;

    /**
     * ApiShareController constructor.
     * @param ApiShareRepository $ApiShareRepository
     */
    public function __construct(ApiShareRepository $apiShareRepository)
    {
        $this->apiShareRepository = $apiShareRepository;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $apiShares = $this->apiShareRepository->getApiShares($request->all());

        return $this->success($apiShares, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * @param Request $request
     * @param  ApiShare $apiShare
     * @return Response
     */
    public function show(Request $request, ApiShare $apiShare)
    {
        $apiShare = $this->apiShareRepository->parserResult($apiShare);

        return $this->success($apiShare, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     *
     * @param ApiShareCreateRequest $request
     *
     * @return Response
     */
    public function store(ApiShareCreateRequest $request)
    {

        $attributes = $request->all();

        $apiShares = $this->apiShareRepository->create($attributes);

        return $this->success($apiShares, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     *
     * @param ApiShareUpdateRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(ApiShareUpdateRequest $request, $id)
    {
        $attributes = $request->all();

        $apiShare =  $this->apiShareRepository->update(['link' => $attributes['link']], $id);

        return $this->success($apiShare, trans('lang::messages.common.modifySuccess'));
    }

    /**
     *
     * @param ApiShare $apiShare
     *
     * @return Response
     */
    public function destroy($id)
    {
        if ($this->apiShareRepository->delete($id)) {
            return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
        }

        return response()->json(null, Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     *
     * @param ApiShare $apiShare
     *
     * @return Response
     */
    public function onOffApi(Request $request, $id)
    {
        $attributes = $request->all();

        $apiShare =  $this->apiShareRepository->update(['is_share' => $attributes['is_share']], $id);

        return $this->success($apiShare, trans('lang::messages.common.modifySuccess'));
    }
}
