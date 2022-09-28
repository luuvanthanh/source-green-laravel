<?php

namespace GGPHP\Fee\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Fee\Http\Requests\CreateSchoolYearRequest;
use GGPHP\Fee\Http\Requests\GetDetailSchoolYearRequest;
use GGPHP\Fee\Http\Requests\UpdateIsCheckSchoolYearRequest;
use GGPHP\Fee\Http\Requests\UpdateSchoolYearRequest;
use GGPHP\Fee\Repositories\Contracts\SchoolYearRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SchoolYearController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $schoolYearRepository;

    /**
     * UserController constructor.
     * @param SchoolYearRepository $schoolYearRepository
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
        $schoolYears = $this->schoolYearRepository->filterSchoolYear($request->all());

        return $this->success($schoolYears, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateSchoolYearRequest $request)
    {
        try {
            $schoolYears = $this->schoolYearRepository->create($request->all());

            return $this->success($schoolYears, trans('lang::messages.common.createSuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\SchoolYear  $schoolYear
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $schoolYear = $this->schoolYearRepository->find($id);
        if ($schoolYear) {
            return $this->success($schoolYear, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\SchoolYear  $schoolYear
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateSchoolYearRequest $request, $id)
    {
        try {
            $credentials = $request->all();
            $schoolYear = $this->schoolYearRepository->update($credentials, $id);
            return $this->success($schoolYear, trans('lang::messages.common.modifySuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\SchoolYear  $schoolYear
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->schoolYearRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    public function schoolYearCrm(Request $request)
    {
        $this->schoolYearRepository->updateSchoolYearCrm($request->all());

        return $this->success([], trans('lang::messages.common.modifySuccess'));
    }

    public function updateAllIsCheckInSchoolYear()
    {
        $schoolYear = $this->schoolYearRepository->updateAllIsCheckInSchoolYear();

        if ($schoolYear) {
            return $this->success($schoolYear, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    public function updateIsCheckSchoolYear(UpdateIsCheckSchoolYearRequest $request, $id)
    {
        $schoolYears = $this->schoolYearRepository->updateIsCheckSchoolYear($request->all(), $id);

        return $this->success($schoolYears, trans('lang::messages.common.createSuccess'));
    }

    public function getDetailSchoolYear(GetDetailSchoolYearRequest $request)
    {
        $schoolYears = $this->schoolYearRepository->getDetailSchoolYear($request->all());

        return $this->success(['data' => array_values($schoolYears)], trans('lang::messages.common.getInfoSuccess'));
    }
}
