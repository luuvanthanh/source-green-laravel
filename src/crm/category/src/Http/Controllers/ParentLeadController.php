<?php

namespace GGPHP\Crm\Category\Http\Controllers;

use GGPHP\Crm\Category\Repositories\Contracts\ParentLeadRepository;
use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Category\Http\Requests\CreateParentLeadRequest;
use GGPHP\Crm\Category\Http\Requests\UpdateParentLeadRequest;

class ParentLeadController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $parentLeadRepository;

    /**
     * UserController constructor.
     * @param ParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(ParentLeadRepository $parentLeadRepository)
    {
        $this->parentLeadRepository = $parentLeadRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $parentLead = $this->parentLeadRepository->getAll($request->all());

        return $this->success($parentLead, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateParentLeadRequest $request)
    {
        $credentials = $request->all();

        $parentLead = $this->parentLeadRepository->create($credentials);

        return $this->success($parentLead, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $parentLead = $this->parentLeadRepository->find($id);

        return $this->success($parentLead, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateParentLeadRequest $request, $id)
    {
        $credentials = $request->all();

        $parentLead = $this->parentLeadRepository->update($credentials, $id);

        return $this->success($parentLead, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $this->parentLeadRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
