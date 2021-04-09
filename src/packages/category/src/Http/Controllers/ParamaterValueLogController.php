<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\ParamaterValueLogCreateRequest;
use GGPHP\Category\Http\Requests\ParamaterValueLogUpdateRequest;
use GGPHP\Category\Repositories\Contracts\ParamaterValueLogRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ParamaterValueLogController extends Controller
{
    /**
     * @var $paramaterValueLogRepository
     */
    protected $paramaterValueLogRepository;

    /**
     * UserController constructor.
     * @param ParamaterValueLogRepository $paramaterValueLogRepository
     */
    public function __construct(ParamaterValueLogRepository $paramaterValueLogRepository)
    {
        $this->paramaterValueLogRepository = $paramaterValueLogRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = config('constants.SEARCH_VALUES_DEFAULT.LIMIT');
        if ($request->has('limit')) {
            $limit = $request->limit;
        }

        if ($limit == config('constants.SEARCH_VALUES_DEFAULT.LIMIT_ZERO')) {
            $paramaterValueLogs = $this->paramaterValueLogRepository->all();
        } else {
            $paramaterValueLogs = $this->paramaterValueLogRepository->paginate($limit);
        }

        return $this->success($paramaterValueLogs, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(ParamaterValueLogCreateRequest $request)
    {
        $credentials = $request->all();
        $paramaterValueLog = $this->paramaterValueLogRepository->create($credentials);
        return $this->success($paramaterValueLog, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $paramaterValueLog = $this->paramaterValueLogRepository->find($id);
        return $this->success($paramaterValueLog, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ParamaterValueLogUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(ParamaterValueLogUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $paramaterValueLog = $this->paramaterValueLogRepository->update($credentials, $id);
        return $this->success($paramaterValueLog, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->paramaterValueLogRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function loadCategory(Request $request)
    {
        $credentials = $request->all();
        $paramaterValueLog = $this->paramaterValueLogRepository->loadCategory($credentials);

        return $this->success($paramaterValueLog, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
