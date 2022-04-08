<?php

namespace GGPHP\Clover\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Clover\Imports\StudentImport;
use GGPHP\Clover\Imports\TimekeepingImport;
use GGPHP\Clover\Models\Student;
use GGPHP\Clover\Repositories\Contracts\StudentRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Maatwebsite\Excel\Facades\Excel;

class StudentController extends Controller
{
    /**
     * @var $studentRepository
     */
    protected $studentRepository;

    /**
     * StudentController constructor.
     * @param StudentRepository $studentRepository
     */
    public function __construct(StudentRepository $studentRepository)
    {
        $this->studentRepository = $studentRepository;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $students = $this->studentRepository->getStudent($request->all());

        return $this->success($students, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * @param Request $request
     * @param $id
     * @return Response
     */
    public function show(Request $request, $id)
    {
        $employee = $this->studentRepository->find($id);

        return $this->success($employee, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function importStudent()
    {
        Excel::import(new StudentImport, request()->file('file'));

        return back();
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function importTimekeeping()
    {
        Excel::import(new TimekeepingImport, request()->file('file'));

        return back();
    }
}
