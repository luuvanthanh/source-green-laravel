<?php

namespace GGPHP\Bio\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Bio\Http\Requests\BioCreateRequest;
use GGPHP\Bio\Http\Requests\BioUpdateRequest;
use GGPHP\Bio\Repositories\Contracts\BioRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BioController extends Controller
{
    /**
     * @var $bioRepository
     */
    protected $bioRepository;

    /**
     * UserController constructor.
     * @param BioRepository $bioRepository
     */
    public function __construct(BioRepository $bioRepository)
    {
        $this->bioRepository = $bioRepository;
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
        $bio = $this->bioRepository->find($id);

        return $this->success($bio, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $bio = $this->bioRepository->getAll($request->all());

        return $this->success($bio, trans('lang::messages.common.getListSuccess'));
    }
}
