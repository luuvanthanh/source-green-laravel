<?php

namespace GGPHP\TeacherAssignment\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\TeacherAssignment\Http\Requests\TeacherAssignmentCreateRequest;
use GGPHP\TeacherAssignment\Http\Requests\TeacherAssignmentUpdateRequest;
use GGPHP\TeacherAssignment\Repositories\Contracts\TeacherAssignmentRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TeacherAssignmentController extends Controller
{
    /**
     * @var $teacherAssignmentRepository
     */
    protected $teacherAssignmentRepository;

    /**
     * UserController constructor.
     * @param TeacherAssignmentRepository $teacherAssignmentRepository
     */
    public function __construct(TeacherAssignmentRepository $teacherAssignmentRepository)
    {
        $this->teacherAssignmentRepository = $teacherAssignmentRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $teacherAssignment = $this->teacherAssignmentRepository->getAll($request->all());

        return $this->success($teacherAssignment, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(TeacherAssignmentCreateRequest $request)
    {
        $teacherAssignment = $this->teacherAssignmentRepository->create($request->all());

        return $this->success($teacherAssignment, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
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
        $teacherAssignment = $this->teacherAssignmentRepository->find($id);

        return $this->success($teacherAssignment, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(TeacherAssignmentUpdateRequest $request, $id)
    {
        $teacherAssignment = $this->teacherAssignmentRepository->update($request->all(), $id);

        return $this->success($teacherAssignment, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->teacherAssignmentRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
