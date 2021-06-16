<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\TrainingMajorCreateRequest;
use GGPHP\Category\Http\Requests\TrainingMajorUpdateRequest;
use GGPHP\Category\Repositories\Contracts\TrainingMajorRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TrainingMajorController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $trainingMajorRepository;

    /**
     * UserController constructor.
     * @param TrainingMajorRepository $trainingMajorRepository
     */
    public function __construct(TrainingMajorRepository $trainingMajorRepository)
    {
        $this->trainingMajorRepository = $trainingMajorRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $trainingMajor = $this->trainingMajorRepository->getTrainingMajor($request->all());

        return $this->success($trainingMajor, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(TrainingMajorCreateRequest $request)
    {
        $credentials = $request->all();
        $trainingMajor = $this->trainingMajorRepository->create($credentials);
        return $this->success($trainingMajor, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $trainingMajor = $this->trainingMajorRepository->find($id);
        return $this->success($trainingMajor, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param TrainingMajorUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(TrainingMajorUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $trainingMajor = $this->trainingMajorRepository->update($credentials, $id);
        return $this->success($trainingMajor, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->trainingMajorRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function loadCategory(Request $request)
    {
        $credentials = $request->all();
        $trainingMajor = $this->trainingMajorRepository->loadCategory($credentials);

        return $this->success($trainingMajor, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
