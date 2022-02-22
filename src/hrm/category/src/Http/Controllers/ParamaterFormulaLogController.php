<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\ParamaterFormulaLogCreateRequest;
use GGPHP\Category\Http\Requests\ParamaterFormulaLogUpdateRequest;
use GGPHP\Category\Repositories\Contracts\ParamaterFormulaLogRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ParamaterFormulaLogController extends Controller
{
    /**
     * @var $paramaterFormulaLogRepository
     */
    protected $paramaterFormulaLogRepository;

    /**
     * UserController constructor.
     * @param ParamaterFormulaLogRepository $paramaterFormulaLogRepository
     */
    public function __construct(ParamaterFormulaLogRepository $paramaterFormulaLogRepository)
    {
        $this->paramaterFormulaLogRepository = $paramaterFormulaLogRepository;
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
            $paramaterFormulaLogs = $this->paramaterFormulaLogRepository->all();
        } else {
            $paramaterFormulaLogs = $this->paramaterFormulaLogRepository->paginate($limit);
        }

        return $this->success($paramaterFormulaLogs, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(ParamaterFormulaLogCreateRequest $request)
    {
        $credentials = $request->all();
        $paramaterFormulaLog = $this->paramaterFormulaLogRepository->create($credentials);
        return $this->success($paramaterFormulaLog, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $paramaterFormulaLog = $this->paramaterFormulaLogRepository->find($id);
        return $this->success($paramaterFormulaLog, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ParamaterFormulaLogUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(ParamaterFormulaLogUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $paramaterFormulaLog = $this->paramaterFormulaLogRepository->update($credentials, $id);
        return $this->success($paramaterFormulaLog, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->paramaterFormulaLogRepository->delete($id);
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
        $paramaterFormulaLog = $this->paramaterFormulaLogRepository->loadCategory($credentials);

        return $this->success($paramaterFormulaLog, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
