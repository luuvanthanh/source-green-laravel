<?php

namespace GGPHP\Reward\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Reward\Http\Requests\DecisionRewardCreateRequest;
use GGPHP\Reward\Repositories\Contracts\DecisionRewardRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DecisionRewardController extends Controller
{
    /**
     * @var $decisionRewardRepository
     */
    protected $decisionRewardRepository;

    /**
     * DecisionRewardController constructor.
     * @param DecisionRewardRepository $decisionRewardRepository
     */
    public function __construct(DecisionRewardRepository $decisionRewardRepository)
    {
        $this->decisionRewardRepository = $decisionRewardRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $decisionRewards = $this->decisionRewardRepository->getDecisionReward($request->all());

        return $this->success($decisionRewards, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreDecisionRewardRequest $request
     * @return Response
     */
    public function store(DecisionRewardCreateRequest $request)
    {
        $decisionRewards = $this->decisionRewardRepository->create($request->all());

        return $this->success($decisionRewards, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return Response
     */
    public function show($id)
    {
        $decisionReward = $this->decisionRewardRepository->find($id);
        return $this->success($decisionReward, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        $decisionRewards = $this->decisionRewardRepository->update($request->all(), $id);
        return $this->success($decisionRewards, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return Response
     */
    public function destroy($id)
    {
        $this->decisionRewardRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function exportWord($id)
    {
        $result = $this->decisionRewardRepository->exportWord($id);

        if (is_string($result)) {
            return $this->error('Export failed', trans('lang::messages.export.template-not-found'), 400);
        }

        return $result;
    }
}
