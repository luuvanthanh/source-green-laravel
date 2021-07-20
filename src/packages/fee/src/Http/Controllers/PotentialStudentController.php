<?php

namespace GGPHP\Fee\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Fee\Http\Requests\CreatePotentialStudentRequest;
use GGPHP\Fee\Http\Requests\UpdatePotentialStudentRequest;
use GGPHP\Fee\Repositories\Contracts\PotentialStudentRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PotentialStudentController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $potentialStudentRepository;

    /**
     * UserController constructor.
     * @param PotentialStudentRepository $potentialStudentRepository
     */
    public function __construct(PotentialStudentRepository $potentialStudentRepository)
    {
        $this->potentialStudentRepository = $potentialStudentRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $potentialStudents = $this->potentialStudentRepository->filterPotentialStudent($request->all());

        return $this->success($potentialStudents, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreatePotentialStudentRequest $request)
    {
        $potentialStudents = $this->potentialStudentRepository->create($request->all());
        return $this->success($potentialStudents, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\PotentialStudent  $potentialStudent
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $potentialStudent = $this->potentialStudentRepository->find($id);
        if ($potentialStudent) {
            return $this->success($potentialStudent, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\PotentialStudent  $potentialStudent
     * @return \Illuminate\Http\Response
     */
    public function update(UpdatePotentialStudentRequest $request, $id)
    {
        $credentials = $request->all();
        $potentialStudent = $this->potentialStudentRepository->update($credentials, $id);
        return $this->success($potentialStudent, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\PotentialStudent  $potentialStudent
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->potentialStudentRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
