<?php

namespace GGPHP\Profile\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Profile\Http\Requests\CollaboratorContractCreateRequest;
use GGPHP\Profile\Http\Requests\CollaboratorContractUpdateRequest;
use GGPHP\Profile\Repositories\Contracts\CollaboratorContractRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CollaboratorContractController extends Controller
{
    /**
     * @var $collaboratorContractRepository
     */
    protected $collaboratorContractRepository;

    /**
     * CollaboratorContractController constructor.
     * @param CollaboratorContractRepository $collaboratorContractRepository
     */
    public function __construct(CollaboratorContractRepository $collaboratorContractRepository)
    {
        $this->collaboratorContractRepository = $collaboratorContractRepository;
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $collaboratorContract = $this->collaboratorContractRepository->getCollaboratorContract($request->all());

        return $this->success($collaboratorContract, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param UpdateOrCreatecollaboratorContractRequest $request
     * @return Response
     */
    public function store(CollaboratorContractCreateRequest $request)
    {
        $collaboratorContract = $this->collaboratorContractRepository->create($request->all());

        return $this->success($collaboratorContract, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(CollaboratorContractUpdateRequest $request, $id)
    {
        $collaboratorContract = $this->collaboratorContractRepository->update($request->all(), $id);

        return $this->success($collaboratorContract, trans('lang::messages.common.modifySuccess'));
    }

    /**y
     * Display the specified resource.
     *
     * @param int $id
     * @return Response
     */
    public function show($id)
    {
        $collaboratorContract = $this->collaboratorContractRepository->find($id);
        if ($collaboratorContract) {
            return $this->success($collaboratorContract, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function destroy($id)
    {
        $this->collaboratorContractRepository->delete($id);
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
        $result = $this->collaboratorContractRepository->exportWord($id);

        if (is_string($result)) {
            return $this->error('Export failed', trans('lang::messages.export.template-not-found'), 400);
        }

        return $result;
    }
}
