<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\TouristDestinationCreateRequest;
use GGPHP\Category\Http\Requests\TouristDestinationUpdateRequest;
use GGPHP\Category\Repositories\Contracts\TouristDestinationRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TouristDestinationController extends Controller
{

    protected $touristDestinationRepository;

    public function __construct(TouristDestinationRepository $touristDestinationRepository)
    {
        $this->touristDestinationRepository = $touristDestinationRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $touristDestination = $this->touristDestinationRepository->getTouristDestination($request->all());

        return $this->success($touristDestination, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TouristDestinationCreateRequest $request)
    {
        $credentials = $request->all();

        $touristDestination = $this->touristDestinationRepository->create($credentials);

        return $this->success($touristDestination, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $touristDestination = $this->touristDestinationRepository->find($id);

        return $this->success($touristDestination, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(TouristDestinationUpdateRequest $request, $id)
    {
        $credentials = $request->all();

        $touristDestination = $this->touristDestinationRepository->update($credentials, $id);

        return $this->success($touristDestination, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->touristDestinationRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
