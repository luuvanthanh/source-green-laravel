<?php

namespace GGPHP\Crm\Facebook\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Facebook\Repositories\Contracts\PageRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PageController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $pageRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(PageRepository $pageRepository)
    {
        $this->pageRepository = $pageRepository;
    }

    public function index(Request $request)
    {
        $page = $this->pageRepository->getPage($request->all());
        return $this->success($page, trans('lang::messages.common.getListSuccess'));
    }

    public function pageSendMessage(Request $request)
    {
        try {
            $mess = $this->pageRepository->pageSendMessage($request->all());

            return $this->success((array) $mess, trans('lang::messages.common.getListSuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage());
        }
    }

    public function store(Request $request)
    {
        $attributes = $request->all();
        $page  = $this->pageRepository->create($attributes);

        return $this->success($page, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
