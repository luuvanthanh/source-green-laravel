<?php

namespace GGPHP\Crm\CustomerLead\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\CustomerLead\Http\Requests\CreateStatusCareRequest;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\StatusCareRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class StatusCareController extends Controller
{

    protected $statusCareRepository;

    public function __construct(StatusCareRepository $statusCareRepository)
    {
        $this->statusCareRepository = $statusCareRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $statusCare = $this->statusCareRepository->getAll($request->all());

        return $this->success($statusCare, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateStatusCareRequest $request)
    {
        $attributes = $request->all();
        
        if (isset($attributes['user_update_info'])) {
            $attributes['user_update_info'] = json_encode($attributes['user_update_info']);
        }
        
        $statusCare = $this->statusCareRepository->create($attributes);
        
        return $this->success($statusCare, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->statusCareRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
