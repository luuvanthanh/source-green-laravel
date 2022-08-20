<?php

namespace GGPHP\Salary\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Salary\Http\Requests\CreatePayrollSessionRequest;
use GGPHP\Salary\Http\Requests\CreatPayRollRequest;
use GGPHP\Salary\Http\Requests\PayslipRequest;
use GGPHP\Salary\Http\Requests\UpdatePayRollRequest;
use GGPHP\Salary\Repositories\Contracts\PayrollRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PayRollController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $payRollRepository;

    /**
     * UserController constructor.
     * @param PayrollRepository $payRollRepository
     */
    public function __construct(PayrollRepository $payRollRepository)
    {
        $this->payRollRepository = $payRollRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $employees = $this->payRollRepository->filterPayRoll($request->all());

        return $this->success($employees, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreatPayRollRequest $request)
    {
        $payRolls = $this->payRollRepository->create($request->all());
        return $this->success($payRolls, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\PayRoll  $payRoll
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $payRoll = $this->payRollRepository->find($id);
        if ($payRoll) {
            return $this->success($payRoll, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\PayRoll  $payRoll
     * @return \Illuminate\Http\Response
     */
    public function update(UpdatePayRollRequest $request, $id)
    {
        $credentials = [
            'isTimesheet' => $request->isTimesheet,
            'isBonus' => $request->isBonus,
            'isOther' => $request->isOther,
        ];

        $payRoll = $this->payRollRepository->update($credentials, $id);
        return $this->success($payRoll, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\PayRoll  $payRoll
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->payRollRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    public function payslip(PayslipRequest $request)
    {
        $payRoll = $this->payRollRepository->payslip($request->all());

        return $this->success($payRoll, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function exportPayroll(Request $request)
    {
        $result = $this->payRollRepository->exportPayroll($request->all());

        if (is_string($result)) {
            return $this->error('Export failed', trans('Template not found'), 400);
        }

        return $result;
    }

    public function exportSalaryPaymentTemplate(Request $request)
    {
        $result = $this->payRollRepository->exportSalaryPaymentTemplate($request->all());

        if (is_string($result)) {
            return $this->error('Export failed', trans('Template not found'), 400);
        }

        return $result;
    }

    public function exportSalaryTemplateGoToBank(Request $request)
    {
        $result = $this->payRollRepository->exportSalaryTemplateGoToBank($request->all());

        if (is_string($result)) {
            return $this->error('Export failed', trans('Template not found'), 400);
        }

        return $result;
    }

    public function payRollSessionForeigner(CreatePayrollSessionRequest $request)
    {
        $payRolls = $this->payRollRepository->payRollSessionForeigner($request->all());

        return $this->success($payRolls, trans('lang::messages.common.createSuccess'));
    }

    public function getPayRollSession(CreatePayrollSessionRequest $request)
    {
        $employees = $this->payRollRepository->getPayRollSession($request->all());

        return $this->success(['data' => $employees], trans('lang::messages.common.getListSuccess'));
    }

    public function payRollSessionLocal(CreatePayrollSessionRequest $request)
    {
        $payRolls = $this->payRollRepository->payRollSessionLocal($request->all());

        return $this->success($payRolls, trans('lang::messages.common.createSuccess'));
    }

    public function payrollGroupByDivision(Request $request)
    {
        $employees = $this->payRollRepository->payrollGroupByDivision($request->all());

        return $this->success(['data' => $employees], trans('lang::messages.common.getListSuccess'));
    }
}
