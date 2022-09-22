<?php

namespace GGPHP\Profile\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Profile\Http\Requests\ProbationaryContractCreateRequest;
use GGPHP\Profile\Http\Requests\ProbationaryContractUpdateRequest;
use GGPHP\Profile\Repositories\Contracts\ProbationaryContractRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProbationaryContractController extends Controller
{
    /**
     * @var $probationaryContractRepository
     */
    protected $probationaryContractRepository;

    /**
     * ProbationaryContractController constructor.
     * @param ProbationaryContractRepository $probationaryContractRepository
     */
    public function __construct(ProbationaryContractRepository $probationaryContractRepository)
    {
        $this->probationaryContractRepository = $probationaryContractRepository;
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $probationaryContract = $this->probationaryContractRepository->getProbationaryContract($request->all());

        return $this->success($probationaryContract, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param UpdateOrCreateprobationaryContractRequest $request
     * @return Response
     */
    public function store(ProbationaryContractCreateRequest $request)
    {
        $probationaryContract = $this->probationaryContractRepository->create($request->all());

        return $this->success($probationaryContract, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(ProbationaryContractUpdateRequest $request, $id)
    {
        $probationaryContract = $this->probationaryContractRepository->update($request->all(), $id);

        return $this->success($probationaryContract, trans('lang::messages.common.modifySuccess'));
    }

    /**y
     * Display the specified resource.
     *
     * @param int $id
     * @return Response
     */
    public function show($id)
    {
        $probationaryContract = $this->probationaryContractRepository->find($id);
        if ($probationaryContract) {
            return $this->success($probationaryContract, trans('lang::messages.common.getInfoSuccess'));
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
        $this->probationaryContractRepository->delete($id);
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
        $result = $this->probationaryContractRepository->exportWord($id);

        if (is_string($result)) {
            return $this->error('Export failed', trans('lang::messages.export.template-not-found'), 400);
        }

        return $result;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function exportWordEnglish($id)
    {
        $result = $this->probationaryContractRepository->exportWordEnglish($id);

        if (is_string($result)) {
            return $this->error('Export failed', trans('lang::messages.export.template-not-found'), 400);
        }

        return $result;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function exportWordAuthority($id)
    {
        $result = $this->probationaryContractRepository->exportWordAuthority($id);

        if (is_string($result)) {
            return $this->error('Export failed', trans('lang::messages.export.template-not-found'), 400);
        }

        return $result;
    }

    public function previewProbationaryContractExportWord($id)
    {
        $result = $this->probationaryContractRepository->previewProbationaryContractExportWord($id);

        return $this->success($result, trans('lang::messages.common.getListSuccess'));
    }
}
