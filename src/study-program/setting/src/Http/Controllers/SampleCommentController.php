<?php

namespace GGPHP\StudyProgram\Setting\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\StudyProgram\Setting\Http\Requests\SampleCommentCreateRequest;
use GGPHP\StudyProgram\Setting\Http\Requests\SampleCommentUpdateRequest;
use GGPHP\StudyProgram\Setting\Repositories\Contracts\SampleCommentRepository;
use Illuminate\Http\Response;

class SampleCommentController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $sampleCommentRepository;

    /**
     * UserController constructor.
     * @param sampleCommentRepository $sampleCommentRepository
     */
    public function __construct(SampleCommentRepository $sampleCommentRepository)
    {
        $this->sampleCommentRepository = $sampleCommentRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $attributes = $request->all();
        $result = $this->sampleCommentRepository->getAll($attributes);

        return $this->success($result, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(SampleCommentCreateRequest $request)
    {
        $attributes = $request->all();
        $result = $this->sampleCommentRepository->createAll($attributes);

        return $this->success($result, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $result = $this->sampleCommentRepository->find($id);

        return $this->success($result, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(SampleCommentUpdateRequest $request, $id)
    {
        $attributes = $request->all();
        $result = $this->sampleCommentRepository->updateAll($attributes, $id);

        return $this->success($result, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->sampleCommentRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
