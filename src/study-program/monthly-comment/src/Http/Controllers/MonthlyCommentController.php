<?php

namespace GGPHP\StudyProgram\MonthlyComment\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\StudyProgram\MonthlyComment\Http\Requests\MonthlyCommentCreateRequest;
use GGPHP\StudyProgram\MonthlyComment\Http\Requests\MonthlyCommentUpdateAllStatusRequest;
use GGPHP\StudyProgram\MonthlyComment\Http\Requests\MonthlyCommentUpdateRequest;
use GGPHP\StudyProgram\MonthlyComment\Http\Requests\MonthlyCommentUpdateStatusRequest;
use GGPHP\StudyProgram\MonthlyComment\Models\MonthlyComment;
use GGPHP\StudyProgram\MonthlyComment\Repositories\Contracts\MonthlyCommentRepository;
use Illuminate\Http\Response;

class MonthlyCommentController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $monthlyCommentRepository;

    /**
     * UserController constructor.
     * @param MonthlyCommentRepository $MonthlyCommentRepository
     */
    public function __construct(MonthlyCommentRepository $monthlyCommentRepository)
    {
        $this->monthlyCommentRepository = $monthlyCommentRepository;
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

        if (!empty($attributes['status'])) {
            $attributes['status'] = MonthlyComment::STATUS[$attributes['status']];
        }
        $result = $this->monthlyCommentRepository->getAll($attributes);

        return $this->success($result, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(MonthlyCommentCreateRequest $request)
    {
        $attributes = $request->all();
        $result = $this->monthlyCommentRepository->createAll($attributes);

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
        $result = $this->monthlyCommentRepository->find($id);

        return $this->success($result, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(MonthlyCommentUpdateRequest $request, $id)
    {
        $attributes = $request->all();
        $result = $this->monthlyCommentRepository->updateAll($attributes, $id);

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
        $this->monthlyCommentRepository->deleteAll($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    public function updateStatusMonthlyComment(MonthlyCommentUpdateStatusRequest $request)
    {
        $attributes = $request->all();
        $result = $this->monthlyCommentRepository->updateStatusMonthlyComment($attributes);

        return $this->success($result, trans('lang::messages.common.modifySuccess'));
    }

    public function notificationMonthlyComment(MonthlyCommentUpdateStatusRequest $request)
    {
        $attributes = $request->all();
        $result = $this->monthlyCommentRepository->notificationMonthlyComment($attributes);

        return $this->success($result, trans('lang::messages.common.modifySuccess'));
    }

    public function updateAllStatusMonthlyComment(MonthlyCommentUpdateAllStatusRequest $request)
    {
        $attributes = $request->all();
        $result = $this->monthlyCommentRepository->updateAllStatusMonthlyComment($attributes);

        return $this->success($result, trans('lang::messages.common.modifySuccess'));
    }

    public function notificationAllStatusMonthlyComment(MonthlyCommentUpdateAllStatusRequest $request)
    {
        $attributes = $request->all();
        $result = $this->monthlyCommentRepository->notificationAllStatusMonthlyComment($attributes);

        return $this->success($result, trans('lang::messages.common.modifySuccess'));
    }
}
