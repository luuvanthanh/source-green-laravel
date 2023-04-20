<?php

namespace GGPHP\InterviewManager\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\InterviewManager\Http\Requests\InterviewerListCreateCompletedInterviewRequest;
use GGPHP\InterviewManager\Http\Requests\InterviewerListCreateRequest;
use GGPHP\InterviewManager\Http\Requests\InterviewerListDeleteRequest;
use GGPHP\InterviewManager\Http\Requests\InterviewerListGetRequest;
use GGPHP\InterviewManager\Http\Requests\InterviewerListUpdateRequest;
use GGPHP\InterviewManager\Repositories\Contracts\DoInterviewRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DoInterviewController extends Controller
{
    protected $doInterviewRepository;

    /**
     * RefundController constructor.
     * @param DoInterviewRepository $refundRepository
     */
    public function __construct(DoInterviewRepository $doInterviewRepository)
    {
        $this->doInterviewRepository = $doInterviewRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $interviewList = $this->doInterviewRepository->index($request->all());

        return $this->success($interviewList, trans('lang::messages.common.getListSuccess'));
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
        $interviewList = $this->doInterviewRepository->find($id);

        return $this->success($interviewList, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(InterviewerListUpdateRequest $request, $id)
    {
        $interviewList = $this->doInterviewRepository->update($request->all(), $id);

        return $this->success($interviewList, trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(InterviewerListDeleteRequest $request, $id)
    {
        $this->doInterviewRepository->delete($id);

        return $this->success([], '', ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    public function completeInterview(InterviewerListCreateCompletedInterviewRequest $request, $id)
    {
        $completeInterview = $this->doInterviewRepository->completeInterview($request->all(), $id);

        return $this->success($completeInterview, trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
    }
}
