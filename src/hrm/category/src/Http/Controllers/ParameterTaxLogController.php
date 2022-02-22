<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\ParameterTaxLogCreateRequest;
use GGPHP\Category\Http\Requests\ParameterTaxLogUpdateRequest;
use GGPHP\Category\Repositories\Contracts\ParameterTaxLogRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ParameterTaxLogController extends Controller
{
    /**
     * @var $paramaterTaxLogRepository
     */
    protected $paramaterTaxLogRepository;

    /**
     * UserController constructor.
     * @param ParameterTaxLogRepository $paramaterTaxLogRepository
     */
    public function __construct(ParameterTaxLogRepository $paramaterTaxLogRepository)
    {
        $this->paramaterTaxLogRepository = $paramaterTaxLogRepository;
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
            $paramaterTaxLogs = $this->paramaterTaxLogRepository->all();
        } else {
            $paramaterTaxLogs = $this->paramaterTaxLogRepository->paginate($limit);
        }

        return $this->success($paramaterTaxLogs, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(ParameterTaxLogCreateRequest $request)
    {
        $credentials = $request->all();
        $paramaterTaxLog = $this->paramaterTaxLogRepository->create($credentials);
        return $this->success($paramaterTaxLog, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $paramaterTaxLog = $this->paramaterTaxLogRepository->find($id);
        return $this->success($paramaterTaxLog, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ParameterTaxLogUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(ParameterTaxLogUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $paramaterTaxLog = $this->paramaterTaxLogRepository->update($credentials, $id);
        return $this->success($paramaterTaxLog, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->paramaterTaxLogRepository->delete($id);
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
        $paramaterTaxLog = $this->paramaterTaxLogRepository->loadCategory($credentials);

        return $this->success($paramaterTaxLog, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
