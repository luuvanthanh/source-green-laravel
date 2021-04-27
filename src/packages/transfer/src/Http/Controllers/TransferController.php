<?php

namespace GGPHP\Transfer\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Transfer\Http\Requests\TransferCreateRequest;
use GGPHP\Transfer\Http\Requests\TransferUpdateRequest;
use GGPHP\Transfer\Repositories\Contracts\TransferRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TransferController extends Controller
{
    /**
     * @var $transferRepository
     */
    protected $transferRepository;

    /**
     * UserController constructor.
     * @param TransferRepository $transferRepository
     */
    public function __construct(TransferRepository $transferRepository)
    {
        $this->transferRepository = $transferRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(TransferCreateRequest $request)
    {
        $transfer = $this->transferRepository->create($request->all());

        return $this->success($transfer, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
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
        $transfer = $this->transferRepository->find($id);

        return $this->success($transfer, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $transfer = $this->transferRepository->getTransfer($request->all());

        return $this->success($transfer, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(TransferUpdateRequest $request, $id)
    {
        $transfer = $this->transferRepository->update($request->all(), $id);

        return $this->success($transfer, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->transferRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function exportWord($id)
    {
        $result = $this->transferRepository->exportWord($id);

        if (is_string($result)) {
            return $this->error('Export failed', trans('lang::messages.export.template-not-found'), 400);
        }

        return $result;
    }

}
