<?php

namespace GGPHP\Clover\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Clover\Repositories\Contracts\ClassProjectRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ClassProjectController extends Controller
{
    /**
     * @var $classProjectRepository
     */
    protected $classProjectRepository;

    /**
     * ClassProjectController constructor.
     * @param classProjectRepository $classProjectRepository
     */
    public function __construct(ClassProjectRepository $classProjectRepository)
    {
        $this->classProjectRepository = $classProjectRepository;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $modules = $this->classProjectRepository->getModule($request->all());

        return $this->success($modules, trans('lang::messages.common.getListSuccess'));
    }
}
