<?php

namespace GGPHP\Crm\Category\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Category\Http\Requests\CreateStatusParentLeadRequest;
use GGPHP\Crm\Category\Http\Requests\UpdateStatusParentLeadRequest;
use GGPHP\Crm\Category\Repositories\Contracts\StatusParentLeadRepository;

class StatusParentLeadController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $statusParentLeadRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(StatusParentLeadRepository $statusParentLeadRepository)
    {
        $this->statusParentLeadRepository = $statusParentLeadRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $statusParentLead = $this->statusParentLeadRepository->getAll($request->all());

        return $this->success($statusParentLead, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateStatusParentLeadRequest $request)
    {
        try {
            $credentials = $request->all();

            $statusParentLead = $this->statusParentLeadRepository->create($credentials);

            return $this->success($statusParentLead, trans('lang::messages.common.createSuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $statusParentLead = $this->statusParentLeadRepository->find($id);

        return $this->success($statusParentLead, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateStatusParentLeadRequest $request, $id)
    {
        $credentials = $request->all();

        $statusParentLead = $this->statusParentLeadRepository->update($credentials, $id);

        return $this->success($statusParentLead, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $this->statusParentLeadRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
