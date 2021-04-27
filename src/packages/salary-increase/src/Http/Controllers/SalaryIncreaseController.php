<?php

namespace GGPHP\SalaryIncrease\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\SalaryIncrease\Http\Requests\SalaryIncreaseCreateRequest;
use GGPHP\SalaryIncrease\Http\Requests\SalaryIncreaseUpdateRequest;
use GGPHP\SalaryIncrease\Repositories\Contracts\SalaryIncreaseRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SalaryIncreaseController extends Controller
{
    /**
     * @var $salaryIncreaseRepository
     */
    protected $salaryIncreaseRepository;

    /**
     * UserController constructor.
     * @param SalaryIncreaseRepository $salaryIncreaseRepository
     */
    public function __construct(SalaryIncreaseRepository $salaryIncreaseRepository)
    {
        $this->salaryIncreaseRepository = $salaryIncreaseRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(SalaryIncreaseCreateRequest $request)
    {
        $salaryIncrease = $this->salaryIncreaseRepository->create($request->all());

        return $this->success($salaryIncrease, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $salaryIncrease = $this->salaryIncreaseRepository->find($id);

        return $this->success($salaryIncrease, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $salaryIncrease = $this->salaryIncreaseRepository->getSalaryIncrease($request->all());

        return $this->success($salaryIncrease, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(SalaryIncreaseUpdateRequest $request, $id)
    {
        $salaryIncrease = $this->salaryIncreaseRepository->update($request->all(), $id);

        return $this->success($salaryIncrease, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->salaryIncreaseRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function exportWord($id)
    {
        $result = $this->salaryIncreaseRepository->exportWord($id);

        if (is_string($result)) {
            return $this->error('Export failed', trans('lang::messages.export.template-not-found'), 400);
        }

        return $result;
    }

}
