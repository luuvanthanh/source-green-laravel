<?php

namespace GGPHP\Profile\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Profile\Http\Requests\LabourContractCreateRequest;
use GGPHP\Profile\Http\Requests\LabourContractUpdateRequest;
use GGPHP\Profile\Http\Requests\SeasonalContractCreateRequest;
use GGPHP\Profile\Http\Requests\SeasonalContractUpdateRequest;
use GGPHP\Profile\Repositories\Contracts\LabourContractRepository;
use GGPHP\Profile\Repositories\Eloquent\SeasonalContractRepositoryEloquent;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SeasonalContractController extends Controller
{
    /**
     * @var $labourContractRepository
     */
    protected $seasonalContractRepository;

    /**
     * LabourContractController constructor.
     * @param seasonalContractRepository $seasonalContractRepository
     */
    public function __construct(SeasonalContractRepositoryEloquent $seasonalContractRepository)
    {
        $this->seasonalContractRepository = $seasonalContractRepository;
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $seasonalContract = $this->seasonalContractRepository->getAll($request->all());

        return $this->success($seasonalContract, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param UpdateOrCreatelabourContractRequest $request
     * @return Response
     */
    public function store(SeasonalContractCreateRequest $request)
    {
        $seasonalContract = $this->seasonalContractRepository->create($request->all());

        return $this->success($seasonalContract, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(SeasonalContractUpdateRequest $request, $id)
    {
        $seasonalContract = $this->seasonalContractRepository->update($request->all(), $id);

        return $this->success($seasonalContract, trans('lang::messages.common.modifySuccess'));
    }

    /**y
     * Display the specified resource.
     *
     * @param int $id
     * @return Response
     */
    public function show($id)
    {
        $seasonalContract = $this->seasonalContractRepository->find($id);
        if ($seasonalContract) {
            return $this->success($seasonalContract, trans('lang::messages.common.getInfoSuccess'));
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
        $this->seasonalContractRepository->delete($id);
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
        $result = $this->seasonalContractRepository->exportWord($id);

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
        $result = $this->seasonalContractRepository->exportWordEnglish($id);

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
        $result = $this->seasonalContractRepository->exportWordAuthority($id);

        if (is_string($result)) {
            return $this->error('Export failed', trans('lang::messages.export.template-not-found'), 400);
        }

        return $result;
    }

    public function previewSeasonalContractExportWord($id)
    {
        $result = $this->seasonalContractRepository->previewSeasonalContractExportWord($id);

        return $this->success($result, trans('lang::messages.common.getListSuccess'));
    }
}
