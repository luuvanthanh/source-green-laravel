<?php

namespace GGPHP\InterviewManager\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\InterviewManager\Http\Requests\EvaluationCriteriaCreateRequest;
use GGPHP\InterviewManager\Http\Requests\EvaluationCriteriaUpdateRequest;
use GGPHP\InterviewManager\Http\Requests\InterviewConfigurationCreateRequest;
use GGPHP\InterviewManager\Http\Requests\InterviewConfigurationDeleteRequest;
use GGPHP\InterviewManager\Http\Requests\InterviewConfigurationUpdateRequest;
use GGPHP\InterviewManager\Http\Requests\InterviewerCreateRequest;
use GGPHP\InterviewManager\Http\Requests\InterviewerDeleteRequest;
use GGPHP\InterviewManager\Http\Requests\InterviewerUpdateRequest;
use GGPHP\InterviewManager\Repositories\Contracts\InterviewConfigurationRepository;
use GGPHP\InterviewManager\Repositories\Contracts\InterviewerRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InterviewConfigurationController extends Controller
{
    protected $interviewConfigurationRepository;

    /**
     * InterviewConfigurationController constructor.
     * @param InterviewConfigurationRepository $refundRepository
     */
    public function __construct(InterviewConfigurationRepository $interviewConfigurationRepository)
    {
        $this->interviewConfigurationRepository = $interviewConfigurationRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $interviewConfiguration = $this->interviewConfigurationRepository->index($request->all());

        return $this->success($interviewConfiguration, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(InterviewConfigurationCreateRequest $request)
    {
        $interviewConfiguration = $this->interviewConfigurationRepository->create($request->all());

        return $this->success($interviewConfiguration, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
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
        $interviewConfiguration = $this->interviewConfigurationRepository->find($id);

        return $this->success($interviewConfiguration, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(InterviewConfigurationUpdateRequest $request, $id)
    {
        $interviewConfiguration = $this->interviewConfigurationRepository->update($request->all(), $id);

        return $this->success($interviewConfiguration, trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(InterviewConfigurationDeleteRequest $request, $id)
    {
        $this->interviewConfigurationRepository->delete($id);

        return $this->success([], '', ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }
}
