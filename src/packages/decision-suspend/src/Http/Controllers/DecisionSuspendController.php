<?php

namespace GGPHP\DecisionSuspend\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\DecisionSuspend\Http\Requests\DecisionSuspendCreateRequest;
use GGPHP\DecisionSuspend\Http\Requests\DecisionSuspendUpdateRequest;
use GGPHP\DecisionSuspend\Repositories\Contracts\DecisionSuspendRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DecisionSuspendController extends Controller
{
    /**
     * @var $decisionSuspendRepository
     */
    protected $decisionSuspendRepository;

    /**
     * UserController constructor.
     * @param DecisionSuspendRepository $decisionSuspendRepository
     */
    public function __construct(DecisionSuspendRepository $decisionSuspendRepository)
    {
        $this->decisionSuspendRepository = $decisionSuspendRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(DecisionSuspendCreateRequest $request)
    {
        $decisionSuspend = $this->decisionSuspendRepository->create($request->all());

        return $this->success($decisionSuspend, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $decisionSuspend = $this->decisionSuspendRepository->find($id);

        return $this->success($decisionSuspend, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $decisionSuspend = $this->decisionSuspendRepository->getDecisionSuspend($request->all());

        return $this->success($decisionSuspend, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(DecisionSuspendUpdateRequest $request, $id)
    {
        $decisionSuspend = $this->decisionSuspendRepository->update($request->all(), $id);

        return $this->success($decisionSuspend, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->decisionSuspendRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function exportWord($id)
    {
        $result = $this->decisionSuspendRepository->exportWord($id);

        if (is_string($result)) {
            return $this->error('Export failed', trans('lang::messages.export.template-not-found'), 400);
        }

        return $result;
    }

}
