<?php

namespace GGPHP\WorkDeclaration\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\WorkDeclaration\Http\Requests\WorkDeclarationCreateRequest;
use GGPHP\WorkDeclaration\Http\Requests\WorkDeclarationUpdateRequest;
use GGPHP\WorkDeclaration\Repositories\Contracts\WorkDeclarationRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WorkDeclarationController extends Controller
{
    /**
     * @var $workDeclarationRepository
     */
    protected $workDeclarationRepository;

    /**
     * UserController constructor.
     * @param WorkDeclarationRepository $workDeclarationRepository
     */
    public function __construct(WorkDeclarationRepository $workDeclarationRepository)
    {
        $this->workDeclarationRepository = $workDeclarationRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(WorkDeclarationCreateRequest $request)
    {
        $workDeclaration = $this->workDeclarationRepository->create($request->all());

        return $this->success([], trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED, 'isShowData' => false]);
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
        $workDeclaration = $this->workDeclarationRepository->find($id);

        return $this->success($workDeclaration, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $workDeclaration = $this->workDeclarationRepository->getWorkDeclaration($request->all());

        return $this->success($workDeclaration, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(WorkDeclarationUpdateRequest $request, $id)
    {
        $workDeclaration = $this->workDeclarationRepository->update($request->all(), $id);

        return $this->success([], trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
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
        $this->workDeclarationRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

}
