<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\DivisionCreateRequest;
use GGPHP\Category\Http\Requests\DivisionUpdateRequest;
use GGPHP\Category\Repositories\Contracts\DivisionRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DivisionController extends Controller
{
    /**
     * @var $divisionRepository
     */
    protected $divisionRepository;

    /**
     * UserController constructor.
     * @param DivisionRepository $divisionRepository
     */
    public function __construct(DivisionRepository $divisionRepository)
    {
        $this->divisionRepository = $divisionRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(DivisionCreateRequest $request)
    {
        $division = $this->divisionRepository->create($request->all());

        return $this->success([], trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED, 'isShowData' => false]);
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
        $division = $this->divisionRepository->find($id);

        return $this->success($division, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $division = $this->divisionRepository->getDivision($request->all());

        return $this->success($division, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(DivisionUpdateRequest $request, $id)
    {
        $division = $this->divisionRepository->update($request->all(), $id);

        return $this->success([], trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
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
        $this->divisionRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

}
