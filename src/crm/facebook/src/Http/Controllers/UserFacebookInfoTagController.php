<?php

namespace GGPHP\Crm\Facebook\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Facebook\Http\Requests\CreateUserFacebookInfoTagRequest;
use GGPHP\Crm\Facebook\Repositories\Contracts\UserFacebookInfoTagRepository;
use Illuminate\Http\Request;

class UserFacebookInfoTagController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $userFacebookInfoTagRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(UserFacebookInfoTagRepository $userFacebookInfoTagRepository)
    {
        $this->userFacebookInfoTagRepository = $userFacebookInfoTagRepository;
    }

    public function index(Request $request)
    {
        $userFacebookInfoTag = $this->userFacebookInfoTagRepository->getUserFacebookInfoTag($request->all());

        return $this->success($userFacebookInfoTag, trans('lang::messages.common.getListSuccess'));
    }

    public function store(CreateUserFacebookInfoTagRequest $request)
    {
        $credentials = $request->all();

        $userFacebookInfoTag = $this->userFacebookInfoTagRepository->create($credentials);

        return $this->success($userFacebookInfoTag, trans('lang::messages.common.modifySuccess'));
    }
}
