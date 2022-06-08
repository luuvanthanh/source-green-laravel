<?php

namespace GGPHP\Refund\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Refund\Repositories\Contracts\StudentRefundDetailRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class StudentRefundDetailController extends Controller
{
    protected $studentRefundDetail;

    /**
     * RefundLeaveController constructor.
     * @param RefundLeaveRepository $studentRefundDetail
     */
    public function __construct(StudentRefundDetailRepository $studentRefundDetail)
    {
        $this->studentRefundDetail = $studentRefundDetail;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $studentRefundDetail = $this->studentRefundDetail->index($request->all());

        return $this->success($studentRefundDetail, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $studentRefundDetail = $this->studentRefundDetail->create($request->all());

        return $this->success($studentRefundDetail, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
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
        $studentRefundDetail = $this->studentRefundDetail->find($id);

        return $this->success($studentRefundDetail, trans('lang::messages.common.getInfoSuccess'));
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
        $studentRefundDetail = $this->studentRefundDetail->update($request->all(), $id);

        return $this->success($studentRefundDetail, trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
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
        $this->studentRefundDetail->delete($id);

        return $this->success([], '', ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }
}
