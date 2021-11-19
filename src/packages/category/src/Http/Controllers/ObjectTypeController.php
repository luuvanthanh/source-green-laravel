<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\ObjectTypeCreateRequest;
use GGPHP\Category\Http\Requests\ObjectTypeUpdateRequest;
use GGPHP\Category\Repositories\Contracts\ObjectTypeRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ObjectTypeController extends Controller
{

    protected $objectTypeRepository;

    public function __construct(ObjectTypeRepository $objectTypeRepository)
    {
        $this->objectTypeRepository = $objectTypeRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $objectType = $this->objectTypeRepository->getObjectType($request->all());

        return $this->success($objectType, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ObjectTypeCreateRequest $request)
    {
        $credentials = $request->all();

        $objectType = $this->objectTypeRepository->create($credentials);

        return $this->success($objectType, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $objectType = $this->objectTypeRepository->find($id);

        return $this->success($objectType, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ObjectTypeUpdateRequest $request, $id)
    {
        $credentials = $request->all();

        $objectType = $this->objectTypeRepository->update($credentials, $id);

        return $this->success($objectType, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->objectTypeRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
