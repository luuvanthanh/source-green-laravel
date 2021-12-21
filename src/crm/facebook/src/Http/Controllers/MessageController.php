<?php

namespace GGPHP\Crm\Facebook\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Facebook\Repositories\Contracts\MessageRepository;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $messageRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(MessageRepository $messageRepository)
    {
        $this->messageRepository = $messageRepository;
    }

    public function index(Request $request)
    {
        $conversation = $this->messageRepository->getMessage($request->all());
        return $this->success($conversation, trans('lang::messages.common.getListSuccess'));
    }
}
