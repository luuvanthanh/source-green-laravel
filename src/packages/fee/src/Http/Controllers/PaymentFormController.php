<?php

namespace GGPHP\Fee\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Fee\Http\Requests\CreatePaymentFormRequest;
use GGPHP\Fee\Http\Requests\UpdatePaymentFormRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PaymentFormController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $paymentFormRepository;

    /**
     * UserController constructor.
     * @param PaymentFormRepository $paymentFormRepository
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
        $paymentForms = $this->paymentFormRepository->filterPaymentForm($request->all());

        return $this->success($paymentForms, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreatePaymentFormRequest $request)
    {
        $paymentForms = $this->paymentFormRepository->create($request->all());
        return $this->success($paymentForms, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\PaymentForm  $paymentForm
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $paymentForm = $this->paymentFormRepository->find($id);
        if ($paymentForm) {
            return $this->success($paymentForm, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\PaymentForm  $paymentForm
     * @return \Illuminate\Http\Response
     */
    public function update(UpdatePaymentFormRequest $request, $id)
    {
        $credentials = $request->all();
        $paymentForm = $this->paymentFormRepository->update($credentials, $id);
        return $this->success($paymentForm, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\PaymentForm  $paymentForm
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->paymentFormRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
