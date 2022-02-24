<?php

namespace GGPHP\EventConfig\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\EventConfig\Http\Requests\EventConfigCreateRequest;
use GGPHP\EventConfig\Http\Requests\EventConfigUpdateRequest;
use GGPHP\EventConfig\Repositories\Contracts\EventConfigRepository;
use GGPHP\EventConfig\Models\EventConfig;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EventConfigController extends Controller
{
    /**
     * @var $eventConfigrRepository
     */
    protected $eventConfigrRepository;

    /**
     * EventConfigController constructor.
     * @param EventConfigRepository $EventConfigRepository
     */
    public function __construct(EventConfigRepository $eventConfigRepository)
    {
        $this->eventConfigRepository = $eventConfigRepository;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $eventConfigs = $this->eventConfigRepository->getEventConfigs($request->all());

        return $this->success($eventConfigs, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * @param Request $request
     * @param  EventConfig $eventConfig
     * @return Response
     */
    public function show(Request $request, EventConfig $eventConfig)
    {
        $eventConfig = $this->eventConfigRepository->parserResult($eventConfig);

        return $this->success($eventConfig, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     *
     * @param EventConfigCreateRequest $request
     *
     * @return Response
     */
    public function store(EventConfigCreateRequest $request)
    {

        $attributes = $request->all();

        $eventConfigs = $this->eventConfigRepository->create($attributes);

        return $this->success($eventConfigs, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     *
     * @param EventConfigUpdateRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(EventConfigUpdateRequest $request, EventConfig $eventConfig)
    {
        $attributes = $request->all();

        $eventConfig =  $this->eventConfigRepository->update($attributes, $eventConfig);

        return $this->success($eventConfig, trans('lang::messages.common.modifySuccess'));
    }

    /**
     *
     * @param EventConfig $eventConfig
     *
     * @return Response
     */
    public function destroy($id)
    {
        if ($this->eventConfigRepository->delete($id)) {
            return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
        }

        return response()->json(null, Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
