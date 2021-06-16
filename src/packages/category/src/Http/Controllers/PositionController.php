<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\PositionCreateRequest;
use GGPHP\Category\Http\Requests\PositionUpdateRequest;
use GGPHP\Category\Repositories\Contracts\PositionRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PositionController extends Controller
{
    /**
     * @var $positionRepository
     */
    protected $positionRepository;

    /**
     * UserController constructor.
     * @param PositionRepository $positionRepository
     */
    public function __construct(PositionRepository $positionRepository)
    {
        $this->positionRepository = $positionRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(PositionCreateRequest $request)
    {
        $position = $this->positionRepository->create($request->all());

        return $this->success($position, trans('lang::messages.common.createSuccess'));
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
        $position = $this->positionRepository->find($id);

        return $this->success($position, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $position = $this->positionRepository->getPosition($request->all());

        return $this->success($position, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(PositionUpdateRequest $request, $id)
    {
        $position = $this->positionRepository->update($request->all(), $id);

        return $this->success($position, trans('lang::messages.common.modifySuccess'));
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
        $this->positionRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

}
