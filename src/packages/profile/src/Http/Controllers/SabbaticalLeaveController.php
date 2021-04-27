<?php

namespace GGPHP\Profile\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Profile\Http\Requests\UpdateOrCreateSabbaticalLeaveRequest;
use GGPHP\Profile\Repositories\Contracts\SabbaticalLeaveRepository;
use Illuminate\Http\Request;

class SabbaticalLeaveController extends Controller
{
    /**
     * @var $sabbaticalLeaveRepository
     */
    protected $sabbaticalLeaveRepository;

    /**
     * SabbaticalLeavesController constructor.
     * @param SabbaticalLeaveRepository $sabbaticalLeaveRepository
     */
    public function __construct(SabbaticalLeaveRepository $sabbaticalLeaveRepository)
    {
        $this->sabbaticalLeaveRepository = $sabbaticalLeaveRepository;
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $sabbaticalLeave = $this->sabbaticalLeaveRepository->all();
        return $this->success($sabbaticalLeave, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param UpdateOrCreateSabbaticalLeaveRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(UpdateOrCreateSabbaticalLeaveRequest $request)
    {
        $data = [
            'annualLeave' => $request->annualLeave,
        ];

        $sabbaticalLeave = $this->sabbaticalLeaveRepository->updateOrCreate(['employeeId' => $request->employeeId], $data);
        return $this->success($sabbaticalLeave, trans('lang-profile::messages.common.modifySuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $sabbaticalLeave = $this->sabbaticalLeaveRepository->find($id);
        if ($sabbaticalLeave) {
            return $this->success($sabbaticalLeave, trans('lang-profile::messages.common.getInfoSuccess'));
        }
    }
}
