<?php

namespace GGPHP\ExpectedTime\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\ExpectedTime\Http\Requests\ExpectedTimeCreateRequest;
use GGPHP\ExpectedTime\Http\Requests\ExpectedTimeUpdateRequest;
use GGPHP\ExpectedTime\Imports\TeacherProfileImport;
use GGPHP\ExpectedTime\Repositories\Contracts\ExpectedTimeRepository;
use GGPHP\TeacherTimekeeping\Models\TeacherTimekeeping;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class ExpectedTimeController extends Controller
{
    /**
     * @var $teacherTimekeepingRepository
     */
    protected $expectedTimeRepository;

    /**
     * UserController constructor.
     * @param expectedTimeRepository $expectedTimeRepository
     */
    public function __construct(ExpectedTimeRepository $expectedTimeRepository)
    {
        $this->expectedTimeRepository = $expectedTimeRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $teacherTimekeeping = $this->expectedTimeRepository->getAll($request->all());

        return $this->success($teacherTimekeeping, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ExpectedTimeCreateRequest $request)
    {
        $attribute = $request->all();

        if (!empty($attribute['type'])) {
            $attribute['type'] = TeacherTimekeeping::TYPE[$attribute['type']];
        }

        if (!empty($attribute['status'])) {
            $attribute['status'] = TeacherTimekeeping::STATUS[$attribute['status']];
        }

        $teacherTimekeeping = $this->expectedTimeRepository->createAll($attribute);

        return $this->success($teacherTimekeeping, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Timekeeping  $timekeeping
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $teacherTimekeeping = $this->expectedTimeRepository->find($id);

        return $this->success($teacherTimekeeping, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Timekeeping  $timekeeping
     * @return \Illuminate\Http\Response
     */
    public function update(ExpectedTimeUpdateRequest $request, $id)
    {
        $attribute = $request->all();

        if (!empty($attribute['type'])) {
            $attribute['type'] = TeacherTimekeeping::TYPE[$attribute['type']];
        }

        if (!empty($attribute['status'])) {
            $attribute['status'] = TeacherTimekeeping::STATUS[$attribute['status']];
        }

        $teacherTimekeeping = $this->expectedTimeRepository->updateAll($attribute, $id);

        return $this->success($teacherTimekeeping, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Timekeeping  $timekeeping
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->expectedTimeRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    public function templateExcelTeacherProfile()
    {
        return Storage::disk('local')->download('excel-exporter/templates' . '/' . 'employee_list_template.xlsx');
    }

    public function importExcelTeacherProfile()
    {
        Excel::import(new TeacherProfileImport(), request()->file('file'));

        return $this->success(['data' =>  'Import thành công'], trans('lang::messages.common.createSuccess'));
    }

    public function exportExcelTeacherProfile(Request $request)
    {
        $result = $this->expectedTimeRepository->exportExcelTeacherProfile($request->all());

        if (is_string($result)) {
            return $this->error('Export failed', trans('lang::messages.export.template-not-found'), 400);
        }

        return $result;
    }
}
