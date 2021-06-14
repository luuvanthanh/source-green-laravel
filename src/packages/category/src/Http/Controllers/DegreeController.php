<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\DegreeCreateRequest;
use GGPHP\Category\Http\Requests\DegreeUpdateRequest;
use GGPHP\Category\Repositories\Contracts\DegreeRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DegreeController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $degreeRepository;

    /**
     * UserController constructor.
     * @param DegreeRepository $degreeRepository
     */
    public function __construct(DegreeRepository $degreeRepository)
    {
        $this->degreeRepository = $degreeRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $degrees = $this->degreeRepository->getDegree($request->all());

        return $this->success($degrees, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(DegreeCreateRequest $request)
    {
        $credentials = $request->all();
        $degree = $this->degreeRepository->create($credentials);
        return $this->success($degree, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $degree = $this->degreeRepository->find($id);
        return $this->success($degree, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param DegreeUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(DegreeUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $degree = $this->degreeRepository->update($credentials, $id);
        return $this->success($degree, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->degreeRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function loadCategory(Request $request)
    {
        $credentials = $request->all();
        $degree = $this->degreeRepository->loadCategory($credentials);

        return $this->success($degree, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
