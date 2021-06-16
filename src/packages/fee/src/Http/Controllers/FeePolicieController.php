<?php

namespace GGPHP\Fee\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Fee\Http\Requests\CreateFeePolicieRequest;
use GGPHP\Fee\Http\Requests\UpdateFeePolicieRequest;
use GGPHP\Fee\Repositories\Contracts\FeePolicieRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FeePolicieController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $feePolicieRepository;

    /**
     * UserController constructor.
     * @param FeePolicieRepository $feePolicieRepository
     */
    public function __construct(FeePolicieRepository $feePolicieRepository)
    {
        $this->feePolicieRepository = $feePolicieRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $feePolicies = $this->feePolicieRepository->filterFeePolicie($request->all());

        return $this->success($feePolicies, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateFeePolicieRequest $request)
    {
        $feePolicies = $this->feePolicieRepository->create($request->all());
        return $this->success($feePolicies, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\FeePolicie  $feePolicie
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $feePolicie = $this->feePolicieRepository->find($id);
        if ($feePolicie) {
            return $this->success($feePolicie, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\FeePolicie  $feePolicie
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateFeePolicieRequest $request, $id)
    {
        $credentials = $request->all();
        $feePolicie = $this->feePolicieRepository->update($credentials, $id);
        return $this->success($feePolicie, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\FeePolicie  $feePolicie
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->feePolicieRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
