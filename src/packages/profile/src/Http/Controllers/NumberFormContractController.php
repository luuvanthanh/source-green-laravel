<?php

namespace GGPHP\Profile\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Profile\Http\Requests\NumberFormContractCreateRequest;
use GGPHP\Profile\Http\Requests\NumberFormContractIndexRequest;
use GGPHP\Profile\Http\Requests\NumberFormContractUpdateRequest;
use GGPHP\Profile\Repositories\Contracts\NumberFormContractRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NumberFormContractController extends Controller
{
    /**
     * @var $numberFormContract
     */
    protected $numberFormContract;

    /**
     * NumberFormContractRepository constructor.
     * @param NumberFormContractRepository $numberFormContract
     */
    public function __construct(NumberFormContractRepository $NumberFormContract)
    {
        $this->numberFormContract = $NumberFormContract;
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(NumberFormContractIndexRequest $request)
    {
        $numberFormContract = $this->numberFormContract->getAll($request->all());

        return $this->success($numberFormContract, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(NumberFormContractCreateRequest $request)
    {
        $numberFormContract = $this->numberFormContract->create($request->all());

        return $this->success($numberFormContract, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(NumberFormContractUpdateRequest $request, $id)
    {
        $numberFormContract = $this->numberFormContract->update($request->all(), $id);

        return $this->success($numberFormContract, trans('lang::messages.common.modifySuccess'));
    }

    /**y
     * Display the specified resource.
     *
     * @param int $id
     * @return Response
     */
    public function show($id)
    {
        $numberFormContract = $this->numberFormContract->find($id);

        return $this->success($numberFormContract, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function destroy($id)
    {
        $this->numberFormContract->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
