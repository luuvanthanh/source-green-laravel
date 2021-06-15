<?php

namespace GGPHP\Fee\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Fee\Http\Requests\CreateFeeRequest;
use GGPHP\Fee\Http\Requests\UpdateFeeRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FeeController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $feeRepository;

    /**
     * UserController constructor.
     * @param FeeRepository $feeRepository
     */
    public function __construct(FeeRepository $feeRepository)
    {
        $this->feeRepository = $feeRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $fee = $this->feeRepository->filterFee($request->all());

        return $this->success($fee, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateFeeRequest $request)
    {
        $fees = $this->feeRepository->create($request->all());
        return $this->success($fees, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Fee  $fee
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $fee = $this->feeRepository->find($id);
        if ($fee) {
            return $this->success($fee, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Fee  $fee
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateFeeRequest $request, $id)
    {
        $credentials = $request->all();
        $fee = $this->feeRepository->update($credentials, $id);
        return $this->success($fee, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Fee  $fee
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->feeRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
