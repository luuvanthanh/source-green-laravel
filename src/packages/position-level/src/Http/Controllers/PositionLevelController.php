<?php

namespace GGPHP\PositionLevel\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\PositionLevel\Http\Requests\PositionLevelCreateRequest;
use GGPHP\PositionLevel\Http\Requests\PositionLevelDeleteRequest;
use GGPHP\PositionLevel\Http\Requests\PositionLevelUpdateRequest;
use GGPHP\PositionLevel\Repositories\Contracts\PositionLevelRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PositionLevelController extends Controller
{
    /**
     * @var $positionLevelRepository
     */
    protected $positionLevelRepository;

    /**
     * UserController constructor.
     * @param PositionLevelRepository $positionLevelRepository
     */
    public function __construct(PositionLevelRepository $positionLevelRepository)
    {
        $this->positionLevelRepository = $positionLevelRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(PositionLevelCreateRequest $request)
    {
        $positionLevel = $this->positionLevelRepository->create($request->all());

        return $this->success($positionLevel, trans('lang::messages.common.createSuccess'));
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
        $positionLevel = $this->positionLevelRepository->find($id);

        return $this->success($positionLevel, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $positionLevel = $this->positionLevelRepository->getPositionLevel($request->all());

        return $this->success($positionLevel, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(PositionLevelUpdateRequest $request, $id)
    {
        $positionLevel = $this->positionLevelRepository->update($request->all(), $id);

        return $this->success($positionLevel, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(PositionLevelDeleteRequest $request, $id)
    {
        $this->positionLevelRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    public function getForUser(Request $request, $id)
    {
        $positionLevel = $this->positionLevelRepository->getForUser($request->all(), $id);

        return $this->success($positionLevel, trans('lang::messages.common.getInfoSuccess'));
    }
}
