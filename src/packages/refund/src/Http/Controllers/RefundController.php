<?php

namespace GGPHP\Refund\Http\Controllers;

use GGPHP\Refund\Repositories\Contracts\RefundRepository;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Refund\Http\Requests\RefundCreateRequest;
use GGPHP\Refund\Http\Requests\RefundUpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RefundController extends Controller
{
    protected $refundRepository;

    /**
     * RefundController constructor.
     * @param RefundRepository $refundRepository
     */
    public function __construct(RefundRepository $refundRepository)
    {
        $this->refundRepository = $refundRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $refundren = $this->refundRepository->index($request->all());

        return $this->success($refundren, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(RefundCreateRequest $request)
    {
        $refundren = $this->refundRepository->create($request->all());

        return $this->success($refundren, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $refund = $this->refundRepository->find($id);

        return $this->success($refund, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(Request $request, $id)
    {
        $refund = $this->refundRepository->update($request->all(), $id);

        return $this->success($refund, trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $this->refundRepository->delete($id);

        return $this->success([], '', ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    public function updateMany(RefundUpdateRequest $request, $id)
    {
        $refund = $this->refundRepository->updateMany($request->all(), $id);
        
        return $this->success($refund, trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
    }

    public function createMany(RefundCreateRequest $request)
    {
        $refund = $this->refundRepository->createMany($request->all());

        return $this->success($refund, trans('lang::messages.common.createSuccess'));
    }
}
