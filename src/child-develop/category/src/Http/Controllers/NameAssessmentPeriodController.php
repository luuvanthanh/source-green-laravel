<?php

namespace GGPHP\ChildDevelop\Category\Http\Controllers;

use GGPHP\ChildDevelop\Category\Http\Requests\NameAssessmentPeriodCreateRequest;
use GGPHP\ChildDevelop\Category\Http\Requests\NameAssessmentPeriodDeleteRequest;
use GGPHP\ChildDevelop\Category\Http\Requests\NameAssessmentPeriodUpdateRequest;
use GGPHP\ChildDevelop\Category\Repositories\Contracts\NameAssessmentPeriodRepository;
use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Response;

class NameAssessmentPeriodController extends Controller
{
    /**
     * @var $nameAssessmentPeriodRepository
     */
    protected $nameAssessmentPeriodRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(NameAssessmentPeriodRepository $nameAssessmentPeriodRepository)
    {
        $this->nameAssessmentPeriodRepository = $nameAssessmentPeriodRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $nameAssessmentPeriod = $this->nameAssessmentPeriodRepository->getAll($request->all());

        return $this->success($nameAssessmentPeriod, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(NameAssessmentPeriodCreateRequest $request)
    {
        $credentials = $request->all();
        $nameAssessmentPeriod = $this->nameAssessmentPeriodRepository->create($credentials);

        return $this->success($nameAssessmentPeriod, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $nameAssessmentPeriod = $this->nameAssessmentPeriodRepository->find($id);

        return $this->success($nameAssessmentPeriod, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(NameAssessmentPeriodUpdateRequest $request, $id)
    {
        $credentials = $request->all();

        $nameAssessmentPeriod = $this->nameAssessmentPeriodRepository->update($credentials, $id);

        return $this->success($nameAssessmentPeriod, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(NameAssessmentPeriodDeleteRequest $request, $id)
    {
        $this->nameAssessmentPeriodRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
