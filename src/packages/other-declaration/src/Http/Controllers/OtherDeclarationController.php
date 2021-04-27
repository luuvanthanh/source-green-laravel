<?php

namespace GGPHP\OtherDeclaration\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\OtherDeclaration\Http\Requests\CreatOtherDeclarationRequest;
use GGPHP\OtherDeclaration\Http\Requests\UpdateOtherDeclarationRequest;
use GGPHP\OtherDeclaration\Repositories\Contracts\OtherDeclarationRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class OtherDeclarationController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $otherDeclarationRepository;

    /**
     * UserController constructor.
     * @param OtherDeclarationRepository $otherDeclarationRepository
     */
    public function __construct(OtherDeclarationRepository $otherDeclarationRepository)
    {
        $this->otherDeclarationRepository = $otherDeclarationRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $employees = $this->otherDeclarationRepository->filterOtherDeclaration($request->all());

        return $this->success($employees, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreatOtherDeclarationRequest $request)
    {
        $otherDeclarations = $this->otherDeclarationRepository->create($request->all());
        return $this->success($otherDeclarations, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\OtherDeclaration  $otherDeclaration
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $otherDeclaration = $this->otherDeclarationRepository->find($id);
        if ($otherDeclaration) {
            return $this->success($otherDeclaration, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\OtherDeclaration  $otherDeclaration
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateOtherDeclarationRequest $request, $id)
    {
        $credentials = $request->all();
        $otherDeclaration = $this->otherDeclarationRepository->update($credentials, $id);
        return $this->success($otherDeclaration, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\OtherDeclaration  $otherDeclaration
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->otherDeclarationRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
