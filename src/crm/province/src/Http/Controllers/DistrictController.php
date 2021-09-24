<?php

namespace GGPHP\Crm\Province\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Province\Http\Requests\CreateDistrictRequest;
use GGPHP\Crm\Province\Imports\ProvinceImport;
use GGPHP\Crm\Province\Repositories\Contracts\DistrictRepository;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class DistrictController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $districtRepository;

    /**
     * UserController constructor.
     * @param ReviewRepository $inOutHistoriesRepository
     */
    public function __construct(DistrictRepository $districtRepository)
    {
        $this->districtRepository = $districtRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $district = $this->districtRepository->getDistrict($request->all());

        return $this->success($district, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateDistrictRequest $request)
    {
        $district = $this->districtRepository->create($request->all());

        return $this->success($district, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $district = $this->districtRepository->find($id);

        return $this->success($district, trans('lang::messages.common.getInfoSuccess'));
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
        $district = $this->districtRepository->update($credentials, $id);

        return $this->success($district, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->districtRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function import()
    {
        Excel::import(new ProvinceImport, request()->file('file'));

        return back();
    }
}
