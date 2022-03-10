<?php

namespace GGPHP\EvaluateTeacher\Category\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Absent\Http\Requests\AbsentCreateRequest;
use GGPHP\EvaluateTeacher\Category\Contracts\RatingLevelRepository;
use GGPHP\EvaluateTeacher\Category\Http\Requests\RatingLevelCreateRequest;
use GGPHP\EvaluateTeacher\Category\Http\Requests\RatingLevelDeleteRequest;
use GGPHP\EvaluateTeacher\Category\Http\Requests\RatingLevelUpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RatingLevelController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $ratingLevelRepository;

    /**
     * UserController constructor.
     * @param RatingLevelRepository $absentRepository
     */
    public function __construct(RatingLevelRepository $ratingLevelRepository)
    {
        $this->ratingLevelRepository = $ratingLevelRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $ratingLevel = $this->ratingLevelRepository->getAll($request->all());

        return $this->success($ratingLevel, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param AbsentCreateRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(RatingLevelCreateRequest $request)
    {
        $ratingLevel = $this->ratingLevelRepository->create($request->all());

        return $this->success($ratingLevel, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $ratingLevel = $this->ratingLevelRepository->find($id);

        return $this->success($ratingLevel, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ratingLevelUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(RatingLevelUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $ratingLevel = $this->ratingLevelRepository->update($credentials, $id);

        return $this->success($ratingLevel, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(RatingLevelDeleteRequest $request, $id)
    {
        $this->ratingLevelRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
