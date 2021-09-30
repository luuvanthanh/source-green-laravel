<?php

namespace GGPHP\Crm\CustomerLead\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\CustomerLead\Http\Requests\CreateStudentInfoRequest;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\StudentInfoRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class StudentInfoController extends Controller
{
    /**
     * 
     * @var $employeeRepository
     */
    protected $studentInfoRepository;

    /**
     * UserController constructor.
     * @param ReviewRepository $inOutHistoriesRepository
     */
    public function __construct(StudentInfoRepository $studentInfoRepository)
    {
        $this->studentInfoRepository = $studentInfoRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $studentInfo = $this->studentInfoRepository->getStudentInfo($request->all());

        return $this->success($studentInfo, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateStudentInfoRequest $request)
    {
        $attributes = $request->all();

        $studentInfo = $this->studentInfoRepository->create($attributes);

        return $this->success($studentInfo, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
