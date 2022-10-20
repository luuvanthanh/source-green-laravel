<?php

namespace GGPHP\BusinessCard\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\BusinessCard\Http\Requests\CreatBusinessCardRequest;
use GGPHP\BusinessCard\Http\Requests\UpdateBusinessCardRequest;
use GGPHP\BusinessCard\Models\BusinessCard;
use GGPHP\BusinessCard\Repositories\Contracts\BusinessCardRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BusinessCardController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $businessCardRepository;

    /**
     * UserController constructor.
     * @param BusinessCardRepository $businessCardRepository
     */
    public function __construct(BusinessCardRepository $businessCardRepository)
    {
        $this->businessCardRepository = $businessCardRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['status'])) {
            $attributes['status'] = BusinessCard::STATUS[$attributes['status']];
        }

        $employees = $this->businessCardRepository->filterBusinessCard($attributes);

        return $this->success($employees, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreatBusinessCardRequest $request)
    {
        $businessCards = $this->businessCardRepository->create($request->all());
        return $this->success($businessCards, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\BusinessCard  $businessCard
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $businessCard = $this->businessCardRepository->find($id);
        if ($businessCard) {
            return $this->success($businessCard, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\BusinessCard  $businessCard
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateBusinessCardRequest $request, $id)
    {
        $credentials = $request->all();
        $businessCard = $this->businessCardRepository->update($credentials, $id);
        return $this->success($businessCard, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\BusinessCard  $businessCard
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->businessCardRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    public function updateStatusBusinessCard(Request $request, $id)
    {
        $attributes = $request->all();

        if (!empty($attributes['status'])) {
            $attributes['status'] = BusinessCard::STATUS[$attributes['status']];
        }

        $businessCard = $this->businessCardRepository->updateStatusBusinessCard($attributes, $id);
        return $this->success($businessCard, trans('lang::messages.common.modifySuccess'));
    }

    public function sendAgain($id)
    {
        $businessCard = $this->businessCardRepository->sendAgain($id);

        return $this->success($businessCard, trans('lang::messages.common.modifySuccess'));
    }
}
