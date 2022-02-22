<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\EducationalLevelCreateRequest;
use GGPHP\Category\Http\Requests\EducationalLevelUpdateRequest;
use GGPHP\Category\Http\Requests\EducationalLevelDeleteRequest;
use GGPHP\Category\Repositories\Contracts\EducationalLevelRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EducationalLevelController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $educationalLevelRepository;

    /**
     * UserController constructor.
     * @param EducationalLevelRepository $educationalLevelRepository
     */
    public function __construct(EducationalLevelRepository $educationalLevelRepository)
    {
        $this->educationalLevelRepository = $educationalLevelRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $educationalLevel = $this->educationalLevelRepository->getEducationalLevel($request->all());

        return $this->success($educationalLevel, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(EducationalLevelCreateRequest $request)
    {
        $credentials = $request->all();
        $educationalLevel = $this->educationalLevelRepository->create($credentials);
        return $this->success($educationalLevel, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $educationalLevel = $this->educationalLevelRepository->find($id);
        return $this->success($educationalLevel, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param EducationalLevelUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(EducationalLevelUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $educationalLevel = $this->educationalLevelRepository->update($credentials, $id);
        return $this->success($educationalLevel, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(EducationalLevelDeleteRequest $request, $id)
    {
        $this->educationalLevelRepository->delete($id);
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
        $educationalLevel = $this->educationalLevelRepository->loadCategory($credentials);

        return $this->success($educationalLevel, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
