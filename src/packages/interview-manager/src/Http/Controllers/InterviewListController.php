<?php

namespace GGPHP\InterviewManager\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\InterviewManager\Http\Requests\InterviewerCreateRequest;
use GGPHP\InterviewManager\Http\Requests\InterviewerDeleteRequest;
use GGPHP\InterviewManager\Http\Requests\InterviewerUpdateRequest;
use GGPHP\InterviewManager\Repositories\Contracts\InterviewerRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InterviewListController extends Controller
{
    protected $interviewerRepository;

    /**
     * RefundController constructor.
     * @param InterviewerRepository $refundRepository
     */
    public function __construct(InterviewerRepository $interviewerRepository)
    {
        $this->interviewerRepository = $interviewerRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $interviewerRepository = $this->interviewerRepository->index($request->all());

        return $this->success($interviewerRepository, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(InterviewerCreateRequest $request)
    {
        $interviewerRepository = $this->interviewerRepository->create($request->all());

        return $this->success($interviewerRepository, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
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
        $interviewerRepository = $this->interviewerRepository->find($id);

        return $this->success($interviewerRepository, trans('lang::messages.common.getInfoSuccess'));
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
        $interviewerRepository = $this->interviewerRepository->update($request->all(), $id);

        return $this->success($interviewerRepository, trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
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
        $this->interviewerRepository->delete($id);

        return $this->success([], '', ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }
}
