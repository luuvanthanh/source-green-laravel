<?php

namespace GGPHP\Crm\Marketing\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Marketing\Http\Requests\CreateMarketingProgramRequest;
use GGPHP\Crm\Marketing\Http\Requests\UpdateMarketingProgramRequest;
use GGPHP\Crm\Marketing\Models\MarketingProgram;
use GGPHP\Crm\Marketing\Repositories\Contracts\MarketingProgramRepository;

class MarketingProgramController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $marketingProgramRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(MarketingProgramRepository $marketingProgramRepository)
    {
        $this->marketingProgramRepository = $marketingProgramRepository;
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
            $attributes['status'] = MarketingProgram::STATUS[$attributes['status']];
        }

        $marketingProgram = $this->marketingProgramRepository->getAll($attributes);

        return $this->success($marketingProgram, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateMarketingProgramRequest $request)
    {
        try {
            $credentials = $request->all();

            if (!empty($credentials['status'])) {
                $credentials['status'] = MarketingProgram::STATUS[$credentials['status']];
            }

            $marketingProgram = $this->marketingProgramRepository->create($credentials);

            return $this->success($marketingProgram, trans('lang::messages.common.createSuccess'));
        } catch (\Throwable $th) {

            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $marketingProgram = $this->marketingProgramRepository->find($id);

        return $this->success($marketingProgram, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateMarketingProgramRequest $request, $id)
    {
        $credentials = $request->all();

        if (!empty($credentials['status'])) {
            $credentials['status'] = MarketingProgram::STATUS[$credentials['status']];
        }

        $marketingProgram = $this->marketingProgramRepository->update($credentials, $id);

        return $this->success($marketingProgram, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $this->marketingProgramRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
