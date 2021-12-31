<?php

namespace GGPHP\DocumentManagement\Http\Controllers;

use GGPHP\DocumentManagement\Http\Requests\DocumentManagementCreateRequest;
use GGPHP\DocumentManagement\Http\Requests\DocumentManagementUpdateRequest;
use GGPHP\DocumentManagement\Repositories\Contracts\DocumentManagementRepository;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\DocumentManagement\Models\DocumentManagement;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DocumentManagementController extends Controller
{
    protected $documentManagementRepository;

    /**
     * DocumentManagementController constructor.
     * @param DocumentManagementRepository $DocumentManagementRepository
     */
    public function __construct(DocumentManagementRepository $documentManagementRepository)
    {
        $this->documentManagementRepository = $documentManagementRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $attributes = $request->all();

        if (isset($attributes['typeOfDocument'])) {
            $attributes['typeOfDocument'] = DocumentManagement::TYPE_DOCUMENT[$attributes['typeOfDocument']];
        }

        $documentManagement = $this->documentManagementRepository->getAll($attributes);

        return $this->success($documentManagement, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(DocumentManagementCreateRequest $request)
    {
        $documentManagement = $this->documentManagementRepository->create($request->all());

        return $this->success($documentManagement, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
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
        $documentManagement = $this->documentManagementRepository->find($id);

        return $this->success($documentManagement, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(DocumentManagementUpdateRequest $request, $id)
    {
        $documentManagement = $this->documentManagementRepository->update($request->all(), $id);

        return $this->success($documentManagement, trans('lang::messages.common.updateSuccess'), ['isShowData' => false]);
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
        $this->documentManagementRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
