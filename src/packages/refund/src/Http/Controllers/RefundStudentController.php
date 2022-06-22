<?php

namespace GGPHP\Refund\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Refund\Http\Requests\RefundStudentCreateRequest;
use GGPHP\Refund\Repositories\Contracts\RefundStudentRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RefundStudentController extends Controller
{
    protected $refundStdentRepository;

    /**
     * RefundStudentController constructor.
     * @param RefundStudentRepository $refundStdentRepository
     */
    public function __construct(RefundStudentRepository $refundStdentRepository)
    {
        $this->refundStdentRepository = $refundStdentRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $refundStdent = $this->refundStdentRepository->index($request->all());

        return $this->success($refundStdent, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $refundStdent = $this->refundStdentRepository->create($request->all());

        return $this->success($refundStdent, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
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
        $refundStdent = $this->refundStdentRepository->find($id);

        return $this->success($refundStdent, trans('lang::messages.common.getInfoSuccess'));
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
        $refundStdent = $this->refundStdentRepository->update($request->all(), $id);

        return $this->success($refundStdent, trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
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
        $this->refundStdentRepository->delete($id);

        return $this->success([], '', ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    public function createMany(RefundStudentCreateRequest $request)
    {
        $result = $this->refundStdentRepository->createMany($request->all());

        return $this->success($result, trans('lang::messages.common.createSuccess'));
    }
}
