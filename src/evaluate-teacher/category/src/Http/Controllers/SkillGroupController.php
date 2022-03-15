<?php

namespace GGPHP\EvaluateTeacher\Category\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Absent\Http\Requests\AbsentCreateRequest;
use GGPHP\EvaluateTeacher\Category\Contracts\RatingLevelRepository;
use GGPHP\EvaluateTeacher\Category\Contracts\SkillGroupRepository;
use GGPHP\EvaluateTeacher\Category\Http\Requests\RatingLevelUpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SkillGroupController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $skillGroupRepository;

    /**
     * UserController constructor.
     * @param SkillGroupRepository $skillGroupRepository
     */
    public function __construct(SkillGroupRepository $skillGroupRepository)
    {
        $this->skillGroupRepository = $skillGroupRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $skillGroup = $this->skillGroupRepository->getAll($request->all());

        return $this->success($skillGroup, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param AbsentCreateRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $skillGroup = $this->skillGroupRepository->create($request->all());

        return $this->success($skillGroup, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $skillGroup = $this->skillGroupRepository->find($id);

        return $this->success($skillGroup, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ratingLevelUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $credentials = $request->all();
        $skillGroup = $this->skillGroupRepository->update($credentials, $id);

        return $this->success($skillGroup, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $this->skillGroupRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
