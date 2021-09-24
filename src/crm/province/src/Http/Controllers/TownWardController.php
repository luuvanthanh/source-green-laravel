<?php

namespace GGPHP\Crm\Province\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Province\Http\Requests\CreateTownWardRequest;
use GGPHP\Crm\Province\Repositories\Contracts\TownWardRepository;
use Illuminate\Http\Request;

class TownWardController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $townWardRepository;

    /**
     * UserController constructor.
     * @param ReviewRepository $inOutHistoriesRepository
     */
    public function __construct(TownWardRepository $townWardRepository)
    {
        $this->townWardRepository = $townWardRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $townWard = $this->townWardRepository->getTownWard($request->all());

        return $this->success($townWard, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateTownWardRequest $request)
    {
        $townWard = $this->townWardRepository->create($request->all());

        return $this->success($townWard, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $townWard = $this->townWardRepository->find($id);

        return $this->success($townWard, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $credentials = $request->all();
        $townWard = $this->townWardRepository->update($credentials, $id);

        return $this->success($townWard, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->townWardRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
