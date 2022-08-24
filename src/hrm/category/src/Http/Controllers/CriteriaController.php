<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\BlockCreateRequest;
use GGPHP\Category\Http\Requests\BlockDeleteRequest;
use GGPHP\Category\Http\Requests\BlockUpdateRequest;
use GGPHP\Category\Http\Requests\CriteriaCreateRequest;
use GGPHP\Category\Http\Requests\CriteriaDeleteRequest;
use GGPHP\Category\Http\Requests\CriteriaUpdateRequest;
use GGPHP\Category\Repositories\Contracts\CriteriaRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CriteriaController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $criteriaRepository;

    /**
     * UserController constructor.
     * @param criteriaRepository $criteriaRepository
     */
    public function __construct(CriteriaRepository $criteriaRepository)
    {
        $this->criteriaRepository = $criteriaRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $criteria = $this->criteriaRepository->getAll($request->all());

        return $this->success($criteria, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(CriteriaCreateRequest $request)
    {
        $credentials = $request->all();
        $criteria = $this->criteriaRepository->createAll($credentials);
        return $this->success($criteria, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $criteria = $this->criteriaRepository->find($id);
        return $this->success($criteria, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param criteriaUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(CriteriaUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $criteria = $this->criteriaRepository->updateAll($credentials, $id);
        return $this->success($criteria, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(CriteriaDeleteRequest $request, $id)
    {
        $this->criteriaRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
