<?php

namespace GGPHP\Notification\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Notification\Http\Requests\NotificationCreateRequest;
use GGPHP\Notification\Http\Requests\NotificationUpdateRequest;
use GGPHP\Notification\Repositories\Contracts\NotificationRepository;
use GGPHP\Users\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NotificationController extends Controller
{
    /**
     * @var $notificationRepository
     */
    protected $notificationRepository;

    /**
     * UserController constructor.
     * @param NotificationRepository $notificationRepository
     */
    public function __construct(NotificationRepository $notificationRepository)
    {
        $this->notificationRepository = $notificationRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(NotificationCreateRequest $request)
    {

        $notification = $this->notificationRepository->create($request->all());

        return $this->success($notification, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
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
        $notification = $this->notificationRepository->find($id);

        return $this->success($notification, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $notification = $this->notificationRepository->getNoti($request->all());

        return $this->success($notification, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(NotificationUpdateRequest $request, $id)
    {
        $notification = $this->notificationRepository->update($request->all(), $id);

        return $this->success($notification, trans('lang::messages.common.modifySuccess'));
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
        $this->notificationRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    /**
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function read($id)
    {
        $notification = $this->notificationRepository->markAsRead($id);

        return $this->success($notification, trans('lang::messages.common.deleteSuccess'));
    }

    /**
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function readAll($id)
    {
        $notification = $this->notificationRepository->readAll($id);

        return $this->success($notification, trans('lang::messages.common.modifySuccess'));
    }
}
