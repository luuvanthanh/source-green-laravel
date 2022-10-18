<?php

namespace GGPHP\Config\Http\Controllers;

use GGPHP\Config\Http\Requests\ConfigCreateRequest;
use GGPHP\Config\Http\Requests\ConfigNotificationCreateRequest;
use GGPHP\Config\Http\Requests\ConfigUpdateRequest;
use GGPHP\Config\Repositories\Contracts\ConfigNotificationRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ConfigNotificationController extends Controller
{
    /**
     * @var $configRepository
     */
    protected $configNotificationRepository;

    /**
     * UserController constructor.
     * @param ConfigNotificationRepository $configNotificationRepository
     */
    public function __construct(ConfigNotificationRepository $configNotificationRepository)
    {
        $this->configNotificationRepository = $configNotificationRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(ConfigNotificationCreateRequest $request)
    {
        $configNotification = $this->configNotificationRepository->createConfigNotification($request->all());

        return $this->success($configNotification, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $configNotification = $this->configNotificationRepository->find($id);

        return $this->success($configNotification, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $configNotification = $this->configNotificationRepository->getConfigNotification($request->all());

        return $this->success($configNotification, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(Request $request, $id)
    {
        $configNotification = $this->configNotificationRepository->update($request->all(), $id);

        return $this->success($configNotification, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->configNotificationRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }
}
