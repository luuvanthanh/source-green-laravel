<?php

namespace GGPHP\Fee\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Fee\Http\Requests\CreateChargeStudentRequest;
use GGPHP\Fee\Http\Requests\UpdateChargeStudentRequest;
use GGPHP\Fee\Repositories\Contracts\ChargeStudentRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ChargeStudentController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $chargeStudentRepository;

    /**
     * UserController constructor.
     * @param ChargeStudentRepository $chargeStudentRepository
     */
    public function __construct(ChargeStudentRepository $chargeStudentRepository)
    {
        $this->chargeStudentRepository = $chargeStudentRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $chargeStudents = $this->chargeStudentRepository->filterChargeStudent($request->all());

        return $this->success($chargeStudents, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateChargeStudentRequest $request)
    {
        try {
            $chargeStudents = $this->chargeStudentRepository->create($request->all());

            return $this->success($chargeStudents, trans('lang::messages.common.createSuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ChargeStudent  $chargeStudent
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $chargeStudent = $this->chargeStudentRepository->find($id);
        if ($chargeStudent) {
            return $this->success($chargeStudent, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ChargeStudent  $chargeStudent
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateChargeStudentRequest $request, $id)
    {
        try {
            $credentials = $request->all();
            $chargeStudent = $this->chargeStudentRepository->update($credentials, $id);

            return $this->success($chargeStudent, trans('lang::messages.common.modifySuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ChargeStudent  $chargeStudent
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->chargeStudentRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
