<?php

namespace GGPHP\Crm\CustomerLead\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\CustomerLead\Http\Requests\CreateReferenceRequest;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\ReferenceRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ReferenceController extends Controller
{

    protected $referenceRepository;

    public function __construct(ReferenceRepository $referenceRepository)
    {
        $this->referenceRepository = $referenceRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $reference = $this->referenceRepository->getAll($request->all());

        return $this->success($reference, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateReferenceRequest $request)
    {
        try {
            $credentials = $request->all();
            $reference = $this->referenceRepository->create($credentials);

            return $this->success($reference, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }
}
