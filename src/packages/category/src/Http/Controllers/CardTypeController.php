<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\CardTypeCreateRequest;
use GGPHP\Category\Http\Requests\CardTypeUpdateRequest;
use GGPHP\Category\Repositories\Contracts\CardTypeRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CardTypeController extends Controller
{

    protected $cardTypeRepository;

    public function __construct(CardTypeRepository $cardTypeRepository)
    {
        $this->cardTypeRepository = $cardTypeRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $cardType = $this->cardTypeRepository->getCardType($request->all());

        return $this->success($cardType, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CardTypeCreateRequest $request)
    {
        $credentials = $request->all();

        $cardType = $this->cardTypeRepository->create($credentials);

        return $this->success($cardType, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $cardType = $this->cardTypeRepository->find($id);

        return $this->success($cardType, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(CardTypeUpdateRequest $request, $id)
    {
        $credentials = $request->all();

        $cardType = $this->cardTypeRepository->update($credentials, $id);

        return $this->success($cardType, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->cardTypeRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
