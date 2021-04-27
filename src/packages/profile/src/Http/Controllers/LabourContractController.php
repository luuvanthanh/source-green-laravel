<?php

namespace GGPHP\Profile\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Profile\Http\Requests\LabourContractCreateRequest;
use GGPHP\Profile\Http\Requests\LabourContractUpdateRequest;
use GGPHP\Profile\Repositories\Contracts\LabourContractRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class LabourContractController extends Controller
{
    /**
     * @var $labourContractRepository
     */
    protected $labourContractRepository;

    /**
     * LabourContractController constructor.
     * @param LabourContractRepository $labourContractRepository
     */
    public function __construct(LabourContractRepository $labourContractRepository)
    {
        $this->labourContractRepository = $labourContractRepository;
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $labourContract = $this->labourContractRepository->getLabourContract($request->all());

        return $this->success($labourContract, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param UpdateOrCreatelabourContractRequest $request
     * @return Response
     */
    public function store(LabourContractCreateRequest $request)
    {
        $labourContract = $this->labourContractRepository->create($request->all());

        return $this->success($labourContract, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(LabourContractUpdateRequest $request, $id)
    {
        $labourContract = $this->labourContractRepository->update($request->all(), $id);

        return $this->success($labourContract, trans('lang::messages.common.modifySuccess'));
    }

    /**y
     * Display the specified resource.
     *
     * @param int $id
     * @return Response
     */
    public function show($id)
    {
        $labourContract = $this->labourContractRepository->find($id);
        if ($labourContract) {
            return $this->success($labourContract, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function destroy($id)
    {
        $this->labourContractRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function exportWord($id)
    {
        $result = $this->labourContractRepository->exportWord($id);

        if (is_string($result)) {
            return $this->error('Export failed', trans('lang::messages.export.template-not-found'), 400);
        }

        return $result;
    }

}
