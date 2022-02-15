<?php

namespace GGPHP\Tariff\PaymentPlan\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Tariff\PaymentPlan\Http\Requests\PaymentPlanCreateRequest;
use GGPHP\Tariff\PaymentPlan\Http\Requests\PaymentPlanUpdateRequest;
use GGPHP\Tariff\PaymentPlan\Repositories\Contracts\PaymentPlanRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PaymentPlanController extends Controller
{
    /**
     * @var $paymentPlanRepository
     */
    protected $paymentPlanRepository;

    /**
     * UserController constructor.
     * @param PaymentPlanRepository $PaymentPlanRepository
     */
    public function __construct(PaymentPlanRepository $paymentPlanRepository)
    {
        $this->paymentPlanRepository = $paymentPlanRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $paymentPlan = $this->paymentPlanRepository->getAll($request->all());

        return $this->success($paymentPlan, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param $request
     * @return \Illuminate\Http\Response
     */
    public function store(PaymentPlanCreateRequest $request)
    {
        $paymentPlan = $this->paymentPlanRepository->create($request->all());

        return $this->success($paymentPlan, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $paymentPlan = $this->paymentPlanRepository->find($id);

        return $this->success($paymentPlan, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param paymentPlanUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(PaymentPlanUpdateRequest $request, $id)
    {
        $attributes = $request->all();
        $paymentPlan = $this->paymentPlanRepository->update($attributes, $id);

        return $this->success($paymentPlan, trans('lang::messages.common.modifySuccess'));
    }

    public function destroy($id)
    {
        $this->paymentPlanRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
