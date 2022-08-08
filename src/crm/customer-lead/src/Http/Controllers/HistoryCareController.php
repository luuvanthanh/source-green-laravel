<?php

namespace GGPHP\Crm\CustomerLead\Http\Controllers;

use GGPHP\Crm\CustomerLead\Http\Requests\EventInfoDeleteRequest;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\HistoryCareRepository;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\CustomerLead\Http\Requests\HistoryCareCreateRequest;
use GGPHP\Crm\CustomerLead\Http\Requests\HistoryCareUpdateRequest;
use GGPHP\Crm\CustomerLead\Models\HistoryCare;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class HistoryCareController extends Controller
{

    protected $historyCareRepository;

    public function __construct(HistoryCareRepository $historyCareRepository)
    {
        $this->historyCareRepository = $historyCareRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $eventInfo = $this->historyCareRepository->getEventInfo($request->all());

        return $this->success($eventInfo, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(HistoryCareCreateRequest $request)
    {
        $credentials = $request->all();

        if (!empty($credentials['status'])) {
            $credentials['status'] = HistoryCare::STATUS[$credentials['status']];
        }
        $eventInfo = $this->historyCareRepository->createHistoryCare($credentials);

        return $this->success($eventInfo, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $eventInfo = $this->historyCareRepository->find($id);

        return $this->success($eventInfo, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(HistoryCareUpdateRequest $request, $id)
    {
        $credentials = $request->all();

        if (!empty($credentials['status'])) {
            $credentials['status'] = HistoryCare::STATUS[$credentials['status']];
        }

        $eventInfo = $this->historyCareRepository->update($credentials, $id);

        return $this->success($eventInfo, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(EventInfoDeleteRequest $request, $id)
    {
        $this->historyCareRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
