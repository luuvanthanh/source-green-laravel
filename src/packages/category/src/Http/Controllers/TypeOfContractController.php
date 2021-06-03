<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\TypeOfContractCreateRequest;
use GGPHP\Category\Http\Requests\TypeOfContractDeleteRequest;
use GGPHP\Category\Http\Requests\TypeOfContractUpdateRequest;
use GGPHP\Category\Repositories\Contracts\TypeOfContractRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TypeOfContractController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $typeOfContractRepository;

    /**
     * UserController constructor.
     * @param TypeOfContractRepository $typeOfContractRepository
     */
    public function __construct(TypeOfContractRepository $typeOfContractRepository)
    {
        $this->typeOfContractRepository = $typeOfContractRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = config('constants.SEARCH_VALUES_DEFAULT.LIMIT');
        if ($request->has('limit')) {
            $limit = $request->limit;
        }

        if ($limit == config('constants.SEARCH_VALUES_DEFAULT.LIMIT_ZERO')) {
            $typeOfContracts = $this->typeOfContractRepository->all();
        } else {
            $typeOfContracts = $this->typeOfContractRepository->paginate($limit);
        }

        return $this->success($typeOfContracts, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(TypeOfContractCreateRequest $request)
    {
        $credentials = $request->all();
        $typeOfContract = $this->typeOfContractRepository->create($credentials);
        return $this->success($typeOfContract, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $typeOfContract = $this->typeOfContractRepository->find($id);
        return $this->success($typeOfContract, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param TypeOfContractUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(TypeOfContractUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $typeOfContract = $this->typeOfContractRepository->update($credentials, $id);
        return $this->success($typeOfContract, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(TypeOfContractDeleteRequest $request, $id)
    {
        $this->typeOfContractRepository->delete($id);
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
        $typeOfContract = $this->typeOfContractRepository->loadCategory($credentials);

        return $this->success($typeOfContract, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
