<?php

namespace GGPHP\Crm\Fee\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Fee\Http\Requests\CreateSchoolYearRequest;
use GGPHP\Crm\Fee\Http\Requests\UpdateSchoolYearRequest;
use GGPHP\Crm\Fee\Repositories\Contracts\SchoolYearRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SchoolYearController extends Controller
{
    /**
     * 
     * @var $employeeRepository
     */
    protected $schoolYearRepository;

    /**
     * UserController constructor.
     * @param ReviewRepository $inOutHistoriesRepository
     */
    public function __construct(SchoolYearRepository $schoolYearRepository)
    {
        $this->schoolYearRepository = $schoolYearRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $schoolYear = $this->schoolYearRepository->getSchoolYear($request->all());

        return $this->success($schoolYear, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateSchoolYearRequest $request)
    {
        $attributes = $request->all();

        $schoolYear = $this->schoolYearRepository->create($attributes);

        return $this->success($schoolYear, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $schoolYear = $this->schoolYearRepository->find($id);

        return $this->success($schoolYear, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateSchoolYearRequest $request, $id)
    {
        $credentials = $request->all();

        $schoolYear = $this->schoolYearRepository->update($credentials, $id);

        return $this->success($schoolYear, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\news  $schoolYear
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->schoolYearRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
