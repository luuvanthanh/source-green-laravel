<?php

namespace GGPHP\Fee\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Fee\Http\Requests\CreateTuitionRequest;
use GGPHP\Fee\Http\Requests\UpdateTuitionRequest;
use GGPHP\Fee\Repositories\Contracts\TuitionRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TuitionController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $tuitionRepository;

    /**
     * UserController constructor.
     * @param TuitionRepository $tuitionRepository
     */
    public function __construct(TuitionRepository $tuitionRepository)
    {
        $this->tuitionRepository = $tuitionRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $tuitions = $this->tuitionRepository->filterTuition($request->all());

        return $this->success($tuitions, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateTuitionRequest $request)
    {
        $tuitions = $this->tuitionRepository->create($request->all());
        return $this->success($tuitions, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Tuition  $tuition
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $tuition = $this->tuitionRepository->find($id);
        if ($tuition) {
            return $this->success($tuition, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Tuition  $tuition
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateTuitionRequest $request, $id)
    {
        $credentials = $request->all();
        $tuition = $this->tuitionRepository->update($credentials, $id);
        return $this->success($tuition, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Tuition  $tuition
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->tuitionRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
