<?php

namespace GGPHP\StudyProgram\ScriptReview\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\StudyProgram\ScriptReview\Http\Requests\ScriptReviewCreateRequest;
use GGPHP\StudyProgram\ScriptReview\Http\Requests\ScriptReviewDeleteRequest;
use GGPHP\StudyProgram\ScriptReview\Http\Requests\ScriptReviewFilterRequest;
use GGPHP\StudyProgram\ScriptReview\Http\Requests\ScriptReviewUpdateRequest;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReview;
use GGPHP\StudyProgram\ScriptReview\Repositories\Contracts\ScriptReviewRepository;
use Illuminate\Http\Response;

class ScriptReviewController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $scriptReviewRepository;

    /**
     * UserController constructor.
     * @param scriptReviewRepository $scriptReviewRepository
     */
    public function __construct(ScriptReviewRepository $scriptReviewRepository)
    {
        $this->scriptReviewRepository = $scriptReviewRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(ScriptReviewFilterRequest $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['type'])) {
            $attributes['type'] = ScriptReview::TYPE[$attributes['type']];
        }

        $result = $this->scriptReviewRepository->getAll($attributes);

        return $this->success($result, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ScriptReviewCreateRequest $request)
    {
        $attributes = $request->all();
        $result = $this->scriptReviewRepository->createAll($attributes);

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
        $result = $this->scriptReviewRepository->find($id);

        return $this->success($result, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ScriptReviewUpdateRequest $request, $id)
    {
        $attributes = $request->all();
        $result = $this->scriptReviewRepository->updateAll($attributes, $id);

        return $this->success($result, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(ScriptReviewDeleteRequest $request, $id)
    {
        $this->scriptReviewRepository->deleteAll($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
