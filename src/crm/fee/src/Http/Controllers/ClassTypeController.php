<?php

namespace GGPHP\Crm\Fee\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Fee\Http\Requests\CreateClassTypeRequest;
use GGPHP\Crm\Fee\Http\Requests\UpdateClassTypeRequest;
use GGPHP\Crm\Fee\Repositories\Contracts\ClassTypeRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ClassTypeController extends Controller
{
    /**
     * 
     * @var $employeeRepository
     */
    protected $classTypeRepository;

    /**
     * UserController constructor.
     * @param classTypeRepository $classTypeRepository
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
        $classType = $this->classTypeRepository->getClassType($request->all());

        return $this->success($classType, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateClassTypeRequest $request)
    {
        $attributes = $request->all();
        $classType = $this->classTypeRepository->create($attributes);

        return $this->success($classType, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $classType = $this->classTypeRepository->find($id);

        return $this->success($classType, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\news  $news
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
     * @param  \App\news  $schoolYear
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->classTypeRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    public function getClassTypeClover()
    {
        $this->classTypeRepository->getClassTypeClover();

        return $this->success([], trans('lang::messages.common.getListSuccess'));
    }
}
