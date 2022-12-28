<?php

namespace GGPHP\ConfigReceiveNotification\Http\Controllers;

use GGPHP\ConfigReceiveNotification\Http\Requests\ConfigReceiveNotificationCreateRequest;
use GGPHP\ConfigReceiveNotification\Http\Requests\ConfigReceiveNotificationTurnOnOffRequest;
use GGPHP\ConfigReceiveNotification\Http\Requests\ConfigReceiveNotificationUpdateRequest;
use GGPHP\ConfigReceiveNotification\Repositories\Contracts\ConfigReceiveNotificationRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx\Rels;

class ConfigReceiveNotificationController extends Controller
{

    protected $configReceiveNotificationRepository;

    public function __construct(ConfigReceiveNotificationRepository $configReceiveNotificationRepository)
    {
        $this->configReceiveNotificationRepository = $configReceiveNotificationRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $configReceiveNotification = $this->configReceiveNotificationRepository->getConfigReceiveNotification($request->all());

        return $this->success($configReceiveNotification, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ConfigReceiveNotificationCreateRequest $request)
    {
        $credentials = $request->all();

        $configReceiveNotification = $this->configReceiveNotificationRepository->create($credentials);

        return $this->success($configReceiveNotification, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $configReceiveNotification = $this->configReceiveNotificationRepository->find($id);

        return $this->success($configReceiveNotification, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ConfigReceiveNotificationUpdateRequest $request, $id)
    {
        $credentials = $request->all();

        $configReceiveNotification = $this->configReceiveNotificationRepository->update($credentials, $id);

        return $this->success($configReceiveNotification, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->configReceiveNotificationRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    public function configReceiveNotificationByUser(Request $request)
    {
        $configReceiveNotification = $this->configReceiveNotificationRepository->configReceiveNotificationByUser($request->all());

        return $this->success($configReceiveNotification, trans('lang::messages.common.getListSuccess'));
    }

    public function turnOnOffConfigReceiveNotification(ConfigReceiveNotificationTurnOnOffRequest $request)
    {
        $configReceiveNotification = $this->configReceiveNotificationRepository->turnOnOffConfigReceiveNotification($request->all());

        return $this->success($configReceiveNotification, trans('lang::messages.common.modifySuccess'));
    }
}
