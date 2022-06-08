<?php

namespace GGPHP\ManualCalculation\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\ManualCalculation\Http\Requests\CopyManualCalculationCreateRequest;
use GGPHP\ManualCalculation\Http\Requests\ManualCalculationCreateRequest;
use GGPHP\ManualCalculation\Repositories\Contracts\ManualCalculationRepository;
use Illuminate\Http\Request;

class ManualCalculationController extends Controller
{
    /**
     * @var $manualCalculationRepository
     */
    protected $manualCalculationRepository;

    /**
     * UserController constructor.
     * @param ManualCalculationRepository $manualCalculationRepository
     */
    public function __construct(ManualCalculationRepository $manualCalculationRepository)
    {
        $this->manualCalculationRepository = $manualCalculationRepository;
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
        $manualCalculation = $this->manualCalculationRepository->find($id);

        return $this->success($manualCalculation, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $manualCalculation = $this->manualCalculationRepository->getAll($request->all());

        return $this->success($manualCalculation, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ManualCalculationCreateRequest $request)
    {
        $manualCalculation = $this->manualCalculationRepository->storeAll($request->all());

        return $this->success($manualCalculation, trans('lang::messages.common.createSuccess'));
    }

    public function copyManualCalculation(CopyManualCalculationCreateRequest $request)
    {
        $manualCalculation = $this->manualCalculationRepository->copyManualCalculation($request->all());

        return $this->success($manualCalculation, trans('lang::messages.common.getListSuccess'));
    }
}
