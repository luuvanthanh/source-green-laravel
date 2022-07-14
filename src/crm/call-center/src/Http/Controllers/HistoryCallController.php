<?php

namespace GGPHP\Crm\CallCenter\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\CallCenter\Http\Requests\UpdateEndCallRequest;
use GGPHP\Crm\CallCenter\Repositories\Contracts\HistoryCallRepository;

class HistoryCallController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $historyCallRepository;

    /**
     * UserController constructor.
     * @param HistoryCallRepository $historyCallRepository
     */
    public function __construct(HistoryCallRepository $historyCallRepository)
    {
        $this->historyCallRepository = $historyCallRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $attributes = $request->all();

        $historyCall = $this->historyCallRepository->getHistoryCall($attributes);

        return $this->success($historyCall, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $attributes = $request->all();

        $historyCall = $this->historyCallRepository->create($attributes);

        return $this->success($historyCall, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $historyCall = $this->historyCallRepository->find($id);

        return $this->success($historyCall, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $attributes = $request->all();

        $historyCall = $this->historyCallRepository->update($attributes, $id);

        return $this->success($historyCall, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->historyCallRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    public function updateEndCall(UpdateEndCallRequest $request)
    {
        $historyCall = $this->historyCallRepository->updateEndCall($request->all());

        return $this->success($historyCall, trans('lang::messages.common.modifySuccess'));
    }

    public function callback(Request $request)
    {
        $this->historyCallRepository->callback($request->all());
    }

    public function updateHistoryCall(Request $request)
    {
        $this->historyCallRepository->updateHistoryCall($request->all());
    }

    public function switchboard()
    {
        $switchboard = $this->historyCallRepository->switchboard();

        return $this->success($switchboard, trans('lang::messages.common.getListSuccess'));
    }
}
