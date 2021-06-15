<?php

namespace GGPHP\Fee\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Fee\Http\Requests\CreateStudentObjectRequest;
use GGPHP\Fee\Http\Requests\UpdateStudentObjectRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class StudentObjectController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $studentObjectRepository;

    /**
     * UserController constructor.
     * @param StudentObjectRepository $studentObjectRepository
     */
    public function __construct(StudentObjectRepository $studentObjectRepository)
    {
        $this->studentObjectRepository = $studentObjectRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $studentObjects = $this->studentObjectRepository->filterStudentObject($request->all());

        return $this->success($studentObjects, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateStudentObjectRequest $request)
    {
        $studentObjects = $this->studentObjectRepository->create($request->all());
        return $this->success($studentObjects, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\StudentObject  $studentObject
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $studentObject = $this->studentObjectRepository->find($id);
        if ($studentObject) {
            return $this->success($studentObject, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\StudentObject  $studentObject
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateStudentObjectRequest $request, $id)
    {
        $credentials = $request->all();
        $studentObject = $this->studentObjectRepository->update($credentials, $id);
        return $this->success($studentObject, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\StudentObject  $studentObject
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->studentObjectRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
