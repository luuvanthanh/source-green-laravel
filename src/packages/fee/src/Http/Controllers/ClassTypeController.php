<?php

namespace GGPHP\Fee\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Fee\Http\Requests\CreateClassTypeRequest;
use GGPHP\Fee\Http\Requests\UpdateClassTypeRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ClassTypeController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $classTypeRepository;

    /**
     * UserController constructor.
     * @param ClassTypeRepository $classTypeRepository
     */
    public function __construct(ClassTypeRepository $classTypeRepository)
    {
        $this->classTypeRepository = $classTypeRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $classTypes = $this->classTypeRepository->filterClassType($request->all());

        return $this->success($classTypes, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateClassTypeRequest $request)
    {
        $classTypes = $this->classTypeRepository->create($request->all());
        return $this->success($classTypes, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ClassType  $classType
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $classType = $this->classTypeRepository->find($id);
        if ($classType) {
            return $this->success($classType, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ClassType  $classType
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateClassTypeRequest $request, $id)
    {
        $credentials = $request->all();
        $classType = $this->classTypeRepository->update($credentials, $id);
        return $this->success($classType, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ClassType  $classType
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->classTypeRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
