<?php

namespace GGPHP\InterviewManager\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\InterviewManager\Http\Requests\InterviewerDeleteRequest;
use GGPHP\InterviewManager\Http\Requests\InterviewerListCreateRequest;
use GGPHP\InterviewManager\Http\Requests\InterviewerUpdateRequest;
use GGPHP\InterviewManager\Repositories\Contracts\InterviewListRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InterviewListController extends Controller
{
    protected $interviewListRepository;

    /**
     * RefundController constructor.
     * @param InterviewListRepository $refundRepository
     */
    public function __construct(InterviewListRepository $interviewListRepository)
    {
        $this->interviewListRepository = $interviewListRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $interviewList = $this->interviewListRepository->index($request->all());

        return $this->success($interviewList, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(InterviewerListCreateRequest $request)
    {
        $interviewList = $this->interviewListRepository->create($request->all());

        return $this->success($interviewList, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
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
        $interviewList = $this->interviewListRepository->find($id);

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
    public function update(InterviewerUpdateRequest $request, $id)
    {
        $interviewList = $this->interviewListRepository->update($request->all(), $id);

        return $this->success($interviewList, trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(InterviewerDeleteRequest $request, $id)
    {
        $this->interviewListRepository->delete($id);

        return $this->success([], '', ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }
}
