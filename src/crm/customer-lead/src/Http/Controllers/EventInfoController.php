<?php

namespace GGPHP\Crm\CustomerLead\Http\Controllers;

use GGPHP\Crm\CustomerLead\Http\Requests\EventInfoCreateRequest;
use GGPHP\Crm\CustomerLead\Http\Requests\EventInfoDeleteRequest;
use GGPHP\Crm\CustomerLead\Http\Requests\EventInfoUpdateRequest;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\EventInfoRepository;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\CustomerLead\Models\EventInfo;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EventInfoController extends Controller
{

    protected $eventInfoRepository;

    public function __construct(EventInfoRepository $eventInfoRepository)
    {
        $this->eventInfoRepository = $eventInfoRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $eventInfo = $this->eventInfoRepository->getEventInfo($request->all());

        return $this->success($eventInfo, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(EventInfoCreateRequest $request)
    {
        $credentials = $request->all();

        if (!empty($credentials['status'])) {
            $credentials['status'] = EventInfo::STATUS[$credentials['status']];
        }
        $eventInfo = $this->eventInfoRepository->create($credentials);

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
        $eventInfo = $this->eventInfoRepository->find($id);

        return $this->success($eventInfo, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(EventInfoUpdateRequest $request, $id)
    {
        $credentials = $request->all();

        $eventInfo = $this->eventInfoRepository->update($credentials, $id);

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
        $this->eventInfoRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
