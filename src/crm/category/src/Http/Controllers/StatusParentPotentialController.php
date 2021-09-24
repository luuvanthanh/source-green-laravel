<?php

namespace GGPHP\Crm\Category\Http\Controllers;

use GGPHP\Crm\Category\Http\Requests\StatusParentPotentialCreateRequest;
use GGPHP\Crm\Category\Http\Requests\StatusParentPotentialDeleteRequest;
use GGPHP\Crm\Category\Http\Requests\StatusParentPotentialUpdateRequest;
use GGPHP\Crm\Category\Repositories\Contracts\StatusParentPotentialRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class StatusParentPotentialController extends Controller
{

    protected $statusParentPotentialRepository;

    public function __construct(StatusParentPotentialRepository $statusParentPotentialRepository)
    {
        $this->statusParentPotentialRepository = $statusParentPotentialRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $statusParentPotential = $this->statusParentPotentialRepository->getStatusParentPotential($request->all());

        return $this->success($statusParentPotential, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StatusParentPotentialCreateRequest $request)
    {
        $credentials = $request->all();

        $statusParentPotential = $this->statusParentPotentialRepository->create($credentials);

        return $this->success($statusParentPotential, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $statusParentPotential = $this->statusParentPotentialRepository->find($id);

        return $this->success($statusParentPotential, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StatusParentPotentialUpdateRequest $request, $id)
    {
        $credentials = $request->all();

        $statusParentPotential = $this->statusParentPotentialRepository->update($credentials, $id);

        return $this->success($statusParentPotential, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(StatusParentPotentialDeleteRequest $request, $id)
    {
        $this->statusParentPotentialRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
