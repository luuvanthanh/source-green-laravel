<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\ProvinceCreateRequest;
use GGPHP\Category\Http\Requests\ProvinceUpdateRequest;
use GGPHP\Category\Repositories\Contracts\ProvinceRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProvinceController extends Controller
{

    protected $provinceRepository;

    public function __construct(ProvinceRepository $provinceRepository)
    {
        $this->provinceRepository = $provinceRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $province = $this->provinceRepository->getProvince($request->all());

        return $this->success($province, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProvinceCreateRequest $request)
    {
        $credentials = $request->all();

        $province = $this->provinceRepository->create($credentials);

        return $this->success($province, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $province = $this->provinceRepository->find($id);

        return $this->success($province, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ProvinceUpdateRequest $request, $id)
    {
        $credentials = $request->all();

        $province = $this->provinceRepository->update($credentials, $id);

        return $this->success($province, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->provinceRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
