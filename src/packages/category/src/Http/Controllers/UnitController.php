<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\UnitCreateRequest;
use GGPHP\Category\Http\Requests\UnitUpdateRequest;
use GGPHP\Category\Repositories\Contracts\UnitRepository;
use GGPHP\Category\Imports\UnitImport;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Maatwebsite\Excel\Facades\Excel;

class UnitController extends Controller
{

    protected $unitRepository;

    public function __construct(UnitRepository $unitRepository)
    {
        $this->unitRepository = $unitRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $unit = $this->unitRepository->getUnit($request->all());

        return $this->success($unit, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UnitCreateRequest $request)
    {
        $credentials = $request->all();

        $unit = $this->unitRepository->create($credentials);

        return $this->success($unit, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $unit = $this->unitRepository->find($id);

        return $this->success($unit, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UnitUpdateRequest $request, $id)
    {
        $credentials = $request->all();

        $unit = $this->unitRepository->update($credentials, $id);

        return $this->success($unit, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->unitRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function importUnit()
    {
        Excel::import(new UnitImport, request()->file('file'));

        return $this->success([], trans('lang::messages.common.importExcelSuccess'));
    }
}
