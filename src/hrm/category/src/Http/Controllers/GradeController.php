<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\GradeCreateRequest;
use GGPHP\Category\Http\Requests\GradeUpdateRequest;
use GGPHP\Category\Repositories\Contracts\GradeRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class GradeController extends Controller
{
    /**
     * @var $gradeRepository
     */
    protected $gradeRepository;

    /**
     * UserController constructor.
     * @param gradeRepository $gradeRepository
     */
    public function __construct(GradeRepository $gradeRepository)
    {
        $this->gradeRepository = $gradeRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $grade = $this->gradeRepository->getAll($request->all());

        return $this->success($grade, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(GradeCreateRequest $request)
    {
        $credentials = $request->all();

        $grade = $this->gradeRepository->createAll($credentials);

        return $this->success($grade, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $grade = $this->gradeRepository->find($id);
        return $this->success($grade, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param gradeUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(GradeUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $grade = $this->gradeRepository->updateAll($credentials, $id);
        return $this->success($grade, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $this->gradeRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
