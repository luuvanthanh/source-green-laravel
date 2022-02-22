<?php

namespace GGPHP\Profile\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Profile\Http\Requests\InsurranceCreateRequest;
use GGPHP\Profile\Http\Requests\InsurranceUpdateRequest;
use GGPHP\Profile\Repositories\Contracts\InsurranceRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InsurranceController extends Controller
{
    /**
     * @var $labourContractRepository
     */
    protected $insurranceRepository;

    /**
     * LabourContractController constructor.
     * @param InsurranceRepository $insurranceRepository
     */
    public function __construct(InsurranceRepository $insurranceRepository)
    {
        $this->insurranceRepository = $insurranceRepository;
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $insurrance = $this->insurranceRepository->getInsurrance($request->all());

        return $this->success($insurrance, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param InsurranceCreateRequest $request
     * @return Response
     */
    public function store(InsurranceCreateRequest $request)
    {

        $insurrance = $this->insurranceRepository->create($request->all());

        return $this->success($insurrance, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  InsurranceUpdateRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(InsurranceUpdateRequest $request, $id)
    {
        $insurrance = $this->insurranceRepository->update($request->all(), $id);

        return $this->success($insurrance, trans('lang::messages.common.modifySuccess'));
    }

    /**y
     * Display the specified resource.
     *
     * @param int $id
     * @return Response
     */
    public function show($id)
    {
        $insurrance = $this->insurranceRepository->find($id);
        if ($insurrance) {
            return $this->success($insurrance, trans('lang::messages.common.getInfoSuccess'));
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
        $this->insurranceRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
