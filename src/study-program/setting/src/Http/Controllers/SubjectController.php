<?php

namespace GGPHP\StudyProgram\Setting\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\StudyProgram\Setting\Http\Requests\SubjectCreateRequest;
use GGPHP\StudyProgram\Setting\Http\Requests\SubjectDeleteRequest;
use GGPHP\StudyProgram\Setting\Http\Requests\SubjectUpdateRequest;
use GGPHP\StudyProgram\Setting\Repositories\Contracts\SubjectRepository;
use Illuminate\Http\Response;

class SubjectController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $subjectRepository;

    /**
     * UserController constructor.
     * @param SubjectRepository $subjectRepository
     */
    public function __construct(SubjectRepository $subjectRepository)
    {
        $this->subjectRepository = $subjectRepository;
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
        $subject = $this->subjectRepository->getAll($attributes);

        return $this->success($subject, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(SubjectCreateRequest $request)
    {
        $attributes = $request->all();
        $subject = $this->subjectRepository->createAll($attributes);

        return $this->success($subject, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $subject = $this->subjectRepository->find($id);

        return $this->success($subject, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(SubjectUpdateRequest $request, $id)
    {
        $attributes = $request->all();
        $subject = $this->subjectRepository->updateAll($attributes, $id);

        return $this->success($subject, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(SubjectDeleteRequest $request, $id)
    {
        $this->subjectRepository->deleteAll($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
