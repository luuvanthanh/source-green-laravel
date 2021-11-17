<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\EventTypeCreateRequest;
use GGPHP\Category\Http\Requests\EventTypeUpdateRequest;
use GGPHP\Category\Repositories\Contracts\EventTypeRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EventTypeController extends Controller
{

    protected $eventTypeRepository;

    public function __construct(EventTypeRepository $eventTypeRepository)
    {
        $this->eventTypeRepository = $eventTypeRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $eventType = $this->eventTypeRepository->getEventType($request->all());

        return $this->success($eventType, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(EventTypeCreateRequest $request)
    {
        $credentials = $request->all();

        $eventType = $this->eventTypeRepository->create($credentials);

        return $this->success($eventType, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $eventType = $this->eventTypeRepository->find($id);

        return $this->success($eventType, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(EventTypeUpdateRequest $request, $id)
    {
        $credentials = $request->all();

        $eventType = $this->eventTypeRepository->update($credentials, $id);

        return $this->success($eventType, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->eventTypeRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
