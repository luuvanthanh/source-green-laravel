<?php

namespace GGPHP\ExpectedTime\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\ExpectedTime\Repositories\Contracts\ExpectedTimeRepository;
use GGPHP\TeacherTimekeeping\Models\TeacherTimekeeping;
use GGPHP\TeacherTimekeeping\Repositories\Contracts\TeacherTimekeepingRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

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
    public function store(Request $request)
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
    public function update(Request $request, $id)
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
}
