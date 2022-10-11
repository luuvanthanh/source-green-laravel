<?php

namespace GGPHP\TeacherTimekeeping\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\TeacherTimekeeping\Http\Requests\CreatTeacherTimekeepingRequest;
use GGPHP\TeacherTimekeeping\Http\Requests\UpdateTeacherTimekeepingRequest;
use GGPHP\TeacherTimekeeping\Models\TeacherTimekeeping;
use GGPHP\TeacherTimekeeping\Repositories\Contracts\TeacherTimekeepingRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TeacherTimekeepingController extends Controller
{
    /**
     * @var $teacherTimekeepingRepository
     */
    protected $teacherTimekeepingRepository;

    /**
     * UserController constructor.
     * @param teacherTimekeepingRepository $teacherTimekeepingRepository
     */
    public function __construct(TeacherTimekeepingRepository $teacherTimekeepingRepository)
    {
        $this->teacherTimekeepingRepository = $teacherTimekeepingRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $teacherTimekeeping = $this->teacherTimekeepingRepository->getAll($request->all());

        return $this->success($teacherTimekeeping, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreatTeacherTimekeepingRequest $request)
    {
        $attribute = $request->all();

        if (!empty($attribute['type'])) {
            $attribute['type'] = TeacherTimekeeping::TYPE[$attribute['type']];
        }

        if (!empty($attribute['status'])) {
            $attribute['status'] = TeacherTimekeeping::STATUS[$attribute['status']];
        }

        $teacherTimekeeping = $this->teacherTimekeepingRepository->create($attribute);

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
        $teacherTimekeeping = $this->teacherTimekeepingRepository->find($id);

        return $this->success($teacherTimekeeping, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Timekeeping  $timekeeping
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateTeacherTimekeepingRequest $request, $id)
    {
        $attribute = $request->all();

        if (!empty($attribute['type'])) {
            $attribute['type'] = TeacherTimekeeping::TYPE[$attribute['type']];
        }

        if (!empty($attribute['status'])) {
            $attribute['status'] = TeacherTimekeeping::STATUS[$attribute['status']];
        }

        $teacherTimekeeping = $this->teacherTimekeepingRepository->update($attribute, $id);

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
        $this->teacherTimekeepingRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeTeacherTimekeeping(Request $request)
    {
        $attribute = $request->all();

        $teacherTimekeeping = $this->teacherTimekeepingRepository->storeTeacherTimekeeping($attribute);

        return $this->success($teacherTimekeeping, trans('lang::messages.common.createSuccess'));
    }
}
