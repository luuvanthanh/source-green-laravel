<?php

namespace GGPHP\ResignationDecision\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\ResignationDecision\Http\Requests\ResignationDecisionCreateRequest;
use GGPHP\ResignationDecision\Http\Requests\ResignationDecisionUpdateRequest;
use GGPHP\ResignationDecision\Repositories\Contracts\ResignationDecisionRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ResignationDecisionController extends Controller
{
    /**
     * @var $resignationDecisionRepository
     */
    protected $resignationDecisionRepository;

    /**
     * UserController constructor.
     * @param ResignationDecisionRepository $resignationDecisionRepository
     */
    public function __construct(ResignationDecisionRepository $resignationDecisionRepository)
    {
        $this->resignationDecisionRepository = $resignationDecisionRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(ResignationDecisionCreateRequest $request)
    {
        $resignationDecision = $this->resignationDecisionRepository->create($request->all());

        return $this->success($resignationDecision, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
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
        $resignationDecision = $this->resignationDecisionRepository->find($id);

        return $this->success($resignationDecision, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $resignationDecision = $this->resignationDecisionRepository->getResignationDecision($request->all());

        return $this->success($resignationDecision, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(ResignationDecisionUpdateRequest $request, $id)
    {
        $resignationDecision = $this->resignationDecisionRepository->update($request->all(), $id);

        return $this->success($resignationDecision, trans('lang::messages.common.modifySuccess'));
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
        $this->resignationDecisionRepository->delete($id);

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
        $result = $this->resignationDecisionRepository->exportWord($id);

        if (is_string($result)) {
            return $this->error('Export failed', trans('lang::messages.export.template-not-found'), 400);
        }

        return $result;
    }
}
