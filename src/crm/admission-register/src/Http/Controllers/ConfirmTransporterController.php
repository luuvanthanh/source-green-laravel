<?php

namespace GGPHP\Crm\AdmissionRegister\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\AdmissionRegister\Http\Requests\ConfirmTransporterCreateRequest;
use GGPHP\Crm\AdmissionRegister\Http\Requests\ExportConfirmTransporterRequest;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\ConfirmTransporterRepository;

class ConfirmTransporterController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $confirmTransporterRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(ConfirmTransporterRepository $confirmTransporterRepository)
    {
        $this->confirmTransporterRepository = $confirmTransporterRepository;
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

        $confirmTransporter = $this->confirmTransporterRepository->getAll($attributes);

        return $this->success($confirmTransporter, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ConfirmTransporterCreateRequest $request)
    {
        $attributes = $request->all();
        
        $confirmTransporter = $this->confirmTransporterRepository->create($attributes);

        return $this->success($confirmTransporter, trans('lang::messages.common.createSuccess'));
    }

    public function exportConfirmTransporter(ExportConfirmTransporterRequest $request)
    {
        $export = $this->confirmTransporterRepository->exportConfirmTransporter($request->all());

        if (is_string($export)) {
            return $this->error('Export failed', trans('lang::messages.export.template-not-found'), 400);
        }

        return $export;
    }
}
