<?php

namespace GGPHP\Crm\CallCenter\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\CallCenter\Http\Requests\CreateEmployeeExtensionRequest;
use GGPHP\Crm\CallCenter\Repositories\Contracts\ExtensionRepository;

class ExtensionController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $extensionRepository;

    /**
     * UserController constructor.
     * @param ExtensionRepository $extensionRepository
     */
    public function __construct(ExtensionRepository $extensionRepository)
    {
        $this->extensionRepository = $extensionRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $attributes = $request->all();

        $extension = $this->extensionRepository->getExtension($attributes);

        return $this->success($extension, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $attributes = $request->all();

        $extension = $this->extensionRepository->create($attributes);

        return $this->success($extension, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $extension = $this->extensionRepository->find($id);

        return $this->success($extension, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $attributes = $request->all();

        $extension = $this->extensionRepository->update($attributes, $id);

        return $this->success($extension, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->extensionRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    public function employeeExtension(CreateEmployeeExtensionRequest $request)
    {
        $this->extensionRepository->employeeExtension($request->all());

        return $this->success([], trans('lang::messages.common.createSuccess'));
    }
}
