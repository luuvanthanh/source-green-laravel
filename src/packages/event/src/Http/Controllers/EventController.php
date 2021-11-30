<?php

namespace GGPHP\Event\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Event\Http\Requests\EventCreateRequest;
use GGPHP\Event\Http\Requests\EventUpdateRequest;
use GGPHP\Event\Models\Event;
use GGPHP\Event\Repositories\Contracts\EventRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EventController extends Controller
{
    /**
     * @var $eventRepository
     */
    protected $eventRepository;

    /**
     * UserController constructor.
     * @param EventRepository $eventRepository
     */
    public function __construct(EventRepository $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(EventCreateRequest $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['warning_level'])) {
            $attributes['warning_level'] = Event::WARNING_LEVEL[$attributes['warning_level']];
        }

        if (!empty($attributes['status'])) {
            $attributes['status'] = Event::STATUS[$attributes['status']];
        }

        if (!empty($attributes['status_detail'])) {
            $attributes['status_detail'] = Event::STATUS_DETAIL[$attributes['status_detail']];
        }

        $event = $this->eventRepository->create($attributes);

        return $this->success($event, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
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
        $event = $this->eventRepository->find($id);
        $this->eventRepository->update(['is_read' => true], $id);

        return $this->success($event, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['warning_level'])) {
            $warningLevel = explode(',', $attributes['warning_level']);
            $newWarningLevel = [];
            foreach ($warningLevel as $value) {
                $newWarningLevel[] = Event::WARNING_LEVEL[$value];
            }

            $attributes['warning_level'] = array_values($newWarningLevel);
        }

        if (!empty($attributes['status'])) {
            $status = explode(',', $attributes['status']);
            $newStatus = [];
            foreach ($status as $value) {
                $newStatus[] = Event::STATUS[$value];
            }

            $attributes['status'] = array_values($newStatus);
        }

        if (!empty($attributes['status_detail'])) {
            $statusDetail = explode(',', $attributes['status_detail']);
            $newStatusDetail = [];
            foreach ($statusDetail as $value) {
                $newStatusDetail[] = Event::STATUS[$value];
            }

            $attributes['status_detail'] = array_values($newStatusDetail);
        }

        $event = $this->eventRepository->getEvent($attributes);

        return $this->success($event, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(EventUpdateRequest $request, $id)
    {
        $attributes = $request->all();

        if (!empty($attributes['warning_level'])) {
            $attributes['warning_level'] = Event::WARNING_LEVEL[$attributes['warning_level']];
        }

        if (!empty($attributes['status'])) {
            $attributes['status'] = Event::STATUS[$attributes['status']];
        }

        if (!empty($attributes['status_detail'])) {
            $attributes['status_detail'] = Event::STATUS_DETAIL[$attributes['status_detail']];
        }

        $event = $this->eventRepository->update($attributes, $id);

        return $this->success($event, trans('lang::messages.common.modifySuccess'));
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
        $this->eventRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function handleEvent(Request $request, $id)
    {
        if (!empty($attributes['status'])) {
            $attributes['status'] = Event::STATUS[$attributes['status']];
        }

        if (!empty($attributes['status_detail'])) {
            $attributes['status_detail'] = Event::STATUS_DETAIL[$attributes['status_detail']];
        }
        $this->eventRepository->update(['is_read' => true], $id);

        $event = $this->eventRepository->handleEvent($request->all(), $id);

        return $this->success($event, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function handleEventMuti(Request $request, $id)
    {
        if (!empty($attributes['status'])) {
            $attributes['status'] = Event::STATUS[$attributes['status']];
        }

        if (!empty($attributes['status_detail'])) {
            $attributes['status_detail'] = Event::STATUS_DETAIL[$attributes['status_detail']];
        }

        $event = $this->eventRepository->handleEventMuti($request->all(), $id);

        return $this->success($event, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function updateHandleEvent(Request $request, $id)
    {
        if (!empty($attributes['status'])) {
            $attributes['status'] = Event::STATUS[$attributes['status']];
        }

        if (!empty($attributes['status_detail'])) {
            $attributes['status_detail'] = Event::STATUS_DETAIL[$attributes['status_detail']];
        }

        $event = $this->eventRepository->updateHandleEvent($request->all(), $id);

        return $this->success($event, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function storeAi(EventCreateRequest $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['warning_level'])) {
            $attributes['warning_level'] = Event::WARNING_LEVEL[$attributes['warning_level']];
        }

        if (!empty($attributes['status'])) {
            $attributes['status'] = Event::STATUS[$attributes['status']];
        }

        if (!empty($attributes['status_detail'])) {
            $attributes['status_detail'] = Event::STATUS_DETAIL[$attributes['status_detail']];
        }

        $event = $this->eventRepository->createAi($attributes);

        return $this->success($event, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
