<?php

namespace GGPHP\Crm\CustomerLead\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\CustomerLead\Http\Requests\CreateStatusLeadRequest;
use GGPHP\Crm\CustomerLead\Models\StatusLead;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\StatusLeadRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class StatusLeadController extends Controller
{

    protected $statusLeadRepository;

    public function __construct(StatusLeadRepository $statusLeadRepository)
    {
        $this->statusLeadRepository = $statusLeadRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $statusLead = $this->statusLeadRepository->getAll($request->all());

        return $this->success($statusLead, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateStatusLeadRequest $request)
    {
        $attributes = $request->all();

        if (isset($attributes['user_update_info'])) {
            $attributes['user_update_info'] = json_encode($attributes['user_update_info']);
        }

        if (!empty($attributes['status'])) {
            $attributes['status'] = StatusLead::STATUS_LEAD[$attributes['status']];
        }
        
        $statusLead = $this->statusLeadRepository->create($attributes);

        return $this->success($statusLead, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->statusLeadRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
