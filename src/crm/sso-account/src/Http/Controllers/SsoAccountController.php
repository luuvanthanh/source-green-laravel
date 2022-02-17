<?php

namespace GGPHP\Crm\SsoAccount\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\SsoAccount\Http\Requests\CreateEmployeeAssignmentRequest;
use GGPHP\Crm\SsoAccount\Http\Requests\CreateSsoAccountRequest;
use GGPHP\Crm\SsoAccount\Http\Requests\UpdateSsoAccountRequest;
use GGPHP\Crm\SsoAccount\Models\SsoAccount;
use GGPHP\Crm\SsoAccount\Repositories\Contracts\SsoAccountRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SsoAccountController extends Controller
{
    /**
     * 
     * @var $employeeRepository
     */
    protected $ssoAccountRepository;

    /**
     * UserController constructor.
     * @param ReviewRepository $inOutHistoriesRepository
     */
    public function __construct(SsoAccountRepository $ssoAccountRepository)
    {
        $this->ssoAccountRepository = $ssoAccountRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $ssoAccount = $this->ssoAccountRepository->getSsoAccount($request->all());

        return $this->success($ssoAccount, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateSsoAccountRequest $request)
    {
        $attributes = $request->all();

        $ssoAccount = $this->ssoAccountRepository->create($attributes);

        return $this->success($ssoAccount, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $ssoAccount = $this->ssoAccountRepository->find($id);

        return $this->success($ssoAccount, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateSsoAccountRequest $request, $id)
    {
        $credentials = $request->all();

        $ssoAccount = $this->ssoAccountRepository->update($credentials, $id);

        return $this->success($ssoAccount, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\news  $SsoAccount
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->ssoAccountRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
