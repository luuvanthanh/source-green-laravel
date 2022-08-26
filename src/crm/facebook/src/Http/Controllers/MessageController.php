<?php

namespace GGPHP\Crm\Facebook\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Facebook\Jobs\SyncMessage;
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
        $messages = $this->messageRepository->getMessage($request->all());

        return $this->success($messages, trans('lang::messages.common.getListSuccess'));
    }

    public function refreshLinkFile(Request $request)
    {
        $messages = $this->messageRepository->refreshLinkFile($request->all());

        return $this->success([], trans('Làm mới link file thành công'));
    }

    public function syncMessage(Request $request)
    {
        dispatch(new SyncMessage($request->all()));

        return $this->success([], trans('lang::messages.common.getListSuccess'));
    }
}
