<?php

namespace GGPHP\ChildDevelop\Category\Http\Controllers;

use GGPHP\ChildDevelop\Category\Http\Requests\AssessmentPeriodCreateRequest;
use GGPHP\ChildDevelop\Category\Http\Requests\AssessmentPeriodUpdateRequest;
use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\ChildDevelop\Category\Http\Requests\CreateCategoryChildIssueRequest;
use GGPHP\ChildDevelop\Category\Http\Requests\UpdateCategoryChildIssueRequest;
use GGPHP\ChildDevelop\Category\Repositories\Contracts\AssessmentPeriodRepository;

class AssessmentPeriodController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $assessmentPeriodRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(AssessmentPeriodRepository $assessmentPeriodRepository)
    {
        $this->assessmentPeriodRepository = $assessmentPeriodRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $assessmentPeriod = $this->assessmentPeriodRepository->getAll($request->all());

        return $this->success($assessmentPeriod, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AssessmentPeriodCreateRequest $request)
    {
        $credentials = $request->all();

        $assessmentPeriod = $this->assessmentPeriodRepository->create($credentials);

        return $this->success($assessmentPeriod, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $assessmentPeriod = $this->assessmentPeriodRepository->find($id);

        return $this->success($assessmentPeriod, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(AssessmentPeriodUpdateRequest $request, $id)
    {
        $credentials = $request->all();

        $assessmentPeriod = $this->assessmentPeriodRepository->update($credentials, $id);

        return $this->success($assessmentPeriod, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->assessmentPeriodRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
