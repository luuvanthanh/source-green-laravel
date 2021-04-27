<?php

namespace GGPHP\Reward\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Reward\Repositories\Contracts\RewardRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RewardController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $rewardRepository;

    /**
     * RewardController constructor.
     * @param RewardRepository $rewardRepository
     */
    public function __construct(RewardRepository $rewardRepository)
    {
        $this->rewardRepository = $rewardRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $limit = config('constants.SEARCH_VALUES_DEFAULT.LIMIT');
        if ($request->has('limit')) {
            $limit = $request->limit;
        }

        $rewards = $this->rewardRepository->getRewardUserList($request->all());

        return $this->success($rewards, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Export a listing of Reward.
     * @param Request $request
     * @return Response
     */
    public function exportReward(Request $request)
    {
        $result = $this->rewardRepository->exportReward($request);

        if (is_string($result)) {
            return $this->error('Export failed', trans('lang::messages.export.template-not-found'), 400);
        }

        return $result;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreRewardRequest $request
     * @return Response
     */
    public function store(Request $request)
    {
        $rewards = $this->rewardRepository->create($request->all());
        return $this->success($rewards, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return Response
     */
    public function show($id)
    {
        $reward = $this->rewardRepository->find($id);
        return $this->success($reward, trans('lang::messages.common.getInfoSuccess'));
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
        $rewards = $this->rewardRepository->update($request->all(), $id);
        return $this->success($rewards, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return Response
     */
    public function destroy($id)
    {
        $this->rewardRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * get list reward by employee
     * @param Request $request
     * @return Response
     */
    public function employeeReward(Request $request)
    {
        $rewards = $this->rewardRepository->getRewardByUser($request->all());
        return $this->success($rewards, trans('lang::messages.common.modifySuccess'));
    }
}
