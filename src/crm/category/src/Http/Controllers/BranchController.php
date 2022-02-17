<?php

namespace GGPHP\Crm\Category\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Category\Http\Requests\CreateBranchRequest;
use GGPHP\Crm\Category\Http\Requests\UpdateBranchRequest;
use GGPHP\Crm\Category\Repositories\Contracts\BranchRepository;

class BranchController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $branchRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(BranchRepository $branchRepository)
    {
        $this->branchRepository = $branchRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $branch = $this->branchRepository->getAll($request->all());

        return $this->success($branch, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateBranchRequest $request)
    {
        $credentials = $request->all();

        $branch = $this->branchRepository->create($credentials);

        return $this->success($branch, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $branch = $this->branchRepository->find($id);

        return $this->success($branch, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateBranchRequest $request, $id)
    {
        $credentials = $request->all();

        $branch = $this->branchRepository->update($credentials, $id);

        return $this->success($branch, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->branchRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
