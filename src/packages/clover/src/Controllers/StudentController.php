<?php

namespace GGPHP\Clover\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Clover\Imports\StudentImport;
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
        $limit = config('constants.SEARCH_VALUES_DEFAULT.LIMIT');
        if ($request->has('limit')) {
            $limit = $request->limit;
        }

        if ($limit == config('constants.SEARCH_VALUES_DEFAULT.LIMIT_ZERO')) {
            $students = $this->studentRepository->all();
        } else {
            $students = $this->studentRepository->paginate($limit);
        }

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
    public function import()
    {
        Excel::import(new StudentImport, request()->file('file'));

        return back();
    }
}
