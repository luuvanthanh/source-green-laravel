<?php

namespace GGPHP\InOutHistories\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\InOutHistories\Http\Requests\CreatInOutHistoriesRequest;
use GGPHP\InOutHistories\Http\Requests\UpdateInOutHistoriesRequest;
use GGPHP\InOutHistories\Repositories\Contracts\InOutHistoriesRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InOutHistoriesController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $inOutHistoriesRepository;

    /**
     * UserController constructor.
     * @param InOutHistoriesRepository $inOutHistoriesRepository
     */
    public function __construct(InOutHistoriesRepository $inOutHistoriesRepository)
    {
        $this->inOutHistoriesRepository = $inOutHistoriesRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $employees = $this->inOutHistoriesRepository->filterInOutHistories($request->all());

        return $this->success($employees, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreatInOutHistoriesRequest $request)
    {
        $inOutHistoriess = $this->inOutHistoriesRepository->create($request->all());
        return $this->success($inOutHistoriess, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\InOutHistories  $inOutHistories
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $inOutHistories = $this->inOutHistoriesRepository->find($id);
        if ($inOutHistories) {
            return $this->success($inOutHistories, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\InOutHistories  $inOutHistories
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateInOutHistoriesRequest $request, $id)
    {
        $credentials = $request->all();
        $inOutHistories = $this->inOutHistoriesRepository->update($credentials, $id);
        return $this->success($inOutHistories, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\InOutHistories  $inOutHistories
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->inOutHistoriesRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
