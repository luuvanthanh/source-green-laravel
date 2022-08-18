<?php

namespace GGPHP\Profile\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Profile\Http\Requests\AuthorizedPersonCreateRequest;
use GGPHP\Profile\Http\Requests\AuthorizedPersonUpdateRequest;
use GGPHP\Profile\Repositories\Contracts\AuthorizedPersonRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AuthorizedPersonController extends Controller
{
    /**
     * @var $authorizedPersonRepository
     */
    protected $authorizedPersonRepository;

    /**
     * LabourContractController constructor.
     * @param AuthorizedPersonRepository $authorizedPersonRepository
     */
    public function __construct(AuthorizedPersonRepository $authorizedPersonRepository)
    {
        $this->authorizedPersonRepository = $authorizedPersonRepository;
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $authorized = $this->authorizedPersonRepository->getAuthorizedPerson($request->all());

        return $this->success($authorized, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param AuthorizedPersonCreateRequest $request
     * @return Response
     */
    public function store(AuthorizedPersonCreateRequest $request)
    {
        $authorized = $this->authorizedPersonRepository->create($request->all());

        return $this->success($authorized, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  AuthorizedPersonUpdateRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(AuthorizedPersonUpdateRequest $request, $id)
    {
        $authorized = $this->authorizedPersonRepository->update($request->all(), $id);

        return $this->success($authorized, trans('lang::messages.common.modifySuccess'));
    }

    /**y
     * Display the specified resource.
     *
     * @param int $id
     * @return Response
     */
    public function show($id)
    {
        $authorized = $this->authorizedPersonRepository->find($id);
        
        if ($authorized) {
            return $this->success($authorized, trans('lang::messages.common.getInfoSuccess'));
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
        $this->authorizedPersonRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
