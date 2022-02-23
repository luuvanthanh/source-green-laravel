<?php

namespace GGPHP\Crm\Marketing\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Marketing\Http\Requests\CreateDataMarketingStudentInfoRequest;
use GGPHP\Crm\Marketing\Repositories\Contracts\DataMarketingStudentInfoRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DataMarketingStudentInfoController extends Controller
{
    /**
     * 
     * @var $employeeRepository
     */
    protected $dataMarketingStudentInfoRepository;

    /**
     * UserController constructor.
     * @param ReviewRepository $inOutHistoriesRepository
     */
    public function __construct(DataMarketingStudentInfoRepository $dataMarketingStudentInfoRepository)
    {
        $this->dataMarketingStudentInfoRepository = $dataMarketingStudentInfoRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $studentInfo = $this->dataMarketingStudentInfoRepository->getStudentInfo($request->all());

        return $this->success($studentInfo, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateDataMarketingStudentInfoRequest $request)
    {
        $attributes = $request->all();

        $studentInfo = $this->dataMarketingStudentInfoRepository->create($attributes);

        return $this->success($studentInfo, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
