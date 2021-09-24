<?php

namespace GGPHP\Crm\Province\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Province\Http\Requests\CreateCityRequest;
use GGPHP\Crm\Province\Repositories\Contracts\CityRepository;
use Illuminate\Http\Request;

class CityController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $cityRepository;

    /**
     * UserController constructor.
     * @param ReviewRepository $inOutHistoriesRepository
     */
    public function __construct(CityRepository $cityRepository)
    {
        $this->cityRepository = $cityRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $city = $this->cityRepository->getCity($request->all());

        return $this->success($city, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateCityRequest $request)
    {
        $city = $this->cityRepository->create($request->all());

        return $this->success($city, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $city = $this->cityRepository->find($id);

        return $this->success($city, trans('lang::messages.common.getInfoSuccess'));
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
        $city = $this->cityRepository->update($credentials, $id);

        return $this->success($city, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->cityRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
