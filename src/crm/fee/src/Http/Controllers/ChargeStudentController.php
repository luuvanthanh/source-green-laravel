<?php

namespace GGPHP\Crm\Fee\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Fee\Http\Requests\CalculatorTuitionRequest;
use GGPHP\Crm\Fee\Http\Requests\CreateChargeStudentRequest;
use GGPHP\Crm\Fee\Http\Requests\UpdateChargeStudentRequest;
use GGPHP\Crm\Fee\Http\Requests\UpdateStatusChargeStudentRequest;
use GGPHP\Crm\Fee\Repositories\Contracts\ChargeStudentRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ChargeStudentController extends Controller
{
    /**
     * 
     * @var $employeeRepository
     */
    protected $chargeStudentRepository;

    /**
     * UserController constructor.
     * @param ReviewRepository $inOutHistoriesRepository
     */
    public function __construct(ChargeStudentRepository $chargeStudent)
    {
        $this->chargeStudentRepository = $chargeStudent;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $chargeStudent = $this->chargeStudentRepository->getChargeStudent($request->all());

        return $this->success($chargeStudent, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateChargeStudentRequest $request)
    {
        $attributes = $request->all();
        $chargeStudent = $this->chargeStudentRepository->create($attributes);

        return $this->success($chargeStudent, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $chargeStudent = $this->chargeStudentRepository->find($id);

        return $this->success($chargeStudent, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateChargeStudentRequest $request, $id)
    {
        $credentials = $request->all();

        $chargeStudent = $this->chargeStudentRepository->update($credentials, $id);

        return $this->success($chargeStudent, trans('lang::messages.common.modifySuccess'));
    }

    public function moneyFeePolicie(CalculatorTuitionRequest $request)
    {
        $moneyFeePolicie = $this->chargeStudentRepository->moneyFeePolicie($request->all());

        return $this->success($moneyFeePolicie, trans('lang::messages.common.getInfoSuccess'));
    }

    public function updateStatusChargeStudent(UpdateStatusChargeStudentRequest $request)
    {
        $chargeStudent = $this->chargeStudentRepository->updateStatusChargeStudent($request->all());

        return $this->success($chargeStudent, trans('lang::messages.common.modifySuccess'));
    }
}
