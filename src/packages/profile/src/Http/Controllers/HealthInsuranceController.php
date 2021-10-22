<?php

namespace GGPHP\Profile\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Profile\Http\Requests\HealthInsuranceCreateRequest;
use GGPHP\Profile\Http\Requests\HealthInsuranceUpdateRequest;
use GGPHP\Profile\Repositories\Contracts\HealthInsuranceRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class HealthInsuranceController extends Controller
{
    /**
     * @var $labourContractRepository
     */
    protected $healthInsurranceRepository;

    /**
     * LabourContractController constructor.
     * @param InsurranceRepository $insurranceRepository
     */
    public function __construct(HealthInsuranceRepository $healthInsurranceRepository)
    {
        $this->healthInsurranceRepository = $healthInsurranceRepository;
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $healthInsurrance = $this->healthInsurranceRepository->getAll($request->all());

        return $this->success($healthInsurrance, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param InsurranceCreateRequest $request
     * @return Response
     */
    public function store(HealthInsuranceCreateRequest $request)
    {

        $healthInsurrance = $this->healthInsurranceRepository->createOrUpdate($request->all());

        return $this->success($healthInsurrance, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  InsurranceUpdateRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(HealthInsuranceUpdateRequest $request, $id)
    {
        $healthInsurrance = $this->healthInsurranceRepository->update($request->all(), $id);

        return $this->success($healthInsurrance, trans('lang::messages.common.modifySuccess'));
    }

    /**y
     * Display the specified resource.
     *
     * @param int $id
     * @return Response
     */
    public function show($id)
    {
        $healthInsurrance = $this->healthInsurranceRepository->find($id);

        return $this->success($healthInsurrance, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function destroy($id)
    {
        $this->healthInsurranceRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
