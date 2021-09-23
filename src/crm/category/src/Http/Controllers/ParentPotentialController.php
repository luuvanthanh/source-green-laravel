<?php

namespace GGPHP\Crm\Category\Http\Controllers;

use GGPHP\Crm\Category\Http\Requests\ParentPotentialCreateRequest;
use GGPHP\Crm\Category\Http\Requests\ParentPotentialDeleteRequest;
use GGPHP\Crm\Category\Http\Requests\ParentPotentialUpdateRequest;
use GGPHP\Crm\Category\Repositories\Contracts\ParentPotentialRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ParentPotentialController extends Controller
{

    protected $parentPotentialRepository;

    public function __construct(ParentPotentialRepository $parentPotentialRepository)
    {
        $this->parentPotentialRepository = $parentPotentialRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $categories = $this->parentPotentialRepository->getParentPotential($request->all());

        return $this->success($categories, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ParentPotentialCreateRequest $request)
    {
        $credentials = $request->all();

        $categories = $this->parentPotentialRepository->create($credentials);

        return $this->success($categories, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $parentPotential = $this->parentPotentialRepository->find($id);

        return $this->success($parentPotential, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ParentPotentialUpdateRequest $request, $id)
    {
        $credentials = $request->all();

        $parentPotential = $this->parentPotentialRepository->update($credentials, $id);

        return $this->success($parentPotential, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(ParentPotentialDeleteRequest $request, $id)
    {
        $this->parentPotentialRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
