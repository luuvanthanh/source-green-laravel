<?php

namespace GGPHP\Fee\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Fee\Http\Requests\CreateChargeOldStudentRequest;
use GGPHP\Fee\Http\Requests\UpdateChargeOldStudentRequest;
use GGPHP\Fee\Repositories\Contracts\ChargeOldStudentRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ChargeOldStudentController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $chargeOldStudentRepository;

    /**
     * UserController constructor.
     * @param ChargeOldStudentRepository $chargeOldStudentRepository
     */
    public function __construct(ChargeOldStudentRepository $chargeOldStudentRepository)
    {
        $this->chargeOldStudentRepository = $chargeOldStudentRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $chargeOldStudents = $this->chargeOldStudentRepository->filterChargeOldStudent($request->all());

        return $this->success($chargeOldStudents, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateChargeOldStudentRequest $request)
    {
        try {
            $chargeOldStudents = $this->chargeOldStudentRepository->create($request->all());

            return $this->success($chargeOldStudents, trans('lang::messages.common.createSuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ChargeOldStudent  $chargeOldStudent
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $chargeOldStudent = $this->chargeOldStudentRepository->find($id);
        if ($chargeOldStudent) {
            return $this->success($chargeOldStudent, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ChargeOldStudent  $chargeOldStudent
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateChargeOldStudentRequest $request, $id)
    {
        try {
            $credentials = $request->all();
            $chargeOldStudent = $this->chargeOldStudentRepository->update($credentials, $id);

            return $this->success($chargeOldStudent, trans('lang::messages.common.modifySuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ChargeOldStudent  $chargeOldStudent
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->chargeOldStudentRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
