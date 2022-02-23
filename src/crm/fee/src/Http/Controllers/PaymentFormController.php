<?php

namespace GGPHP\Crm\Fee\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Fee\Repositories\Contracts\PaymentFormRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PaymentFormController extends Controller
{
    /**
     * 
     * @var $employeeRepository
     */
    protected $paymentFormRepository;

    /**
     * UserController constructor.
     * @param ReviewRepository $inOutHistoriesRepository
     */
    public function __construct(PaymentFormRepository $paymentFormRepository)
    {
        $this->paymentFormRepository = $paymentFormRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $paymentForm = $this->paymentFormRepository->getPaymentForm($request->all());

        return $this->success($paymentForm, trans('lang::messages.common.getListSuccess'));
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
        $paymentForm = $this->paymentFormRepository->create($attributes);

        return $this->success($paymentForm, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $paymentForm = $this->paymentFormRepository->find($id);

        return $this->success($paymentForm, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $credentials = $request->all();

        $paymentForm = $this->paymentFormRepository->update($credentials, $id);

        return $this->success($paymentForm, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\news  $paymentForm
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->paymentFormRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    public function getPaymentFormClover()
    {
        $this->paymentFormRepository->getPaymentFormClover();

        return $this->success([], trans('lang::messages.common.getListSuccess'));
    }
}
