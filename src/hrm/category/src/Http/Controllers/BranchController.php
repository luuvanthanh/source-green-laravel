<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\BranchCreateRequest;
use GGPHP\Category\Http\Requests\BranchUpdateRequest;
use GGPHP\Category\Http\Requests\BranchDeleteRequest;
use GGPHP\Category\Repositories\Contracts\BranchRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BranchController extends Controller
{
    /**
     * @var $branchRepository
     */
    protected $branchRepository;

    /**
     * UserController constructor.
     * @param BranchRepository $branchRepository
     */
    public function __construct(BranchRepository $branchRepository)
    {
        $this->branchRepository = $branchRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(BranchCreateRequest $request)
    {
        $branch = $this->branchRepository->create($request->all());

        return $this->success($branch, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED, 'isShowData' => false]);
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
        $branch = $this->branchRepository->find($id);

        return $this->success($branch, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $branch = $this->branchRepository->getBranch($request->all());

        return $this->success($branch, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(BranchUpdateRequest $request, $id)
    {
        $branch = $this->branchRepository->update($request->all(), $id);

        return $this->success($branch, trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(BranchDeleteRequest $request, $id)
    {
        $this->branchRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }
}
