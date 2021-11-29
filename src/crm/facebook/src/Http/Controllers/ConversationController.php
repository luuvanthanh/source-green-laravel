<?php

namespace GGPHP\Crm\Facebook\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Facebook\Repositories\Contracts\ConversationRepository;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $conversationRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(ConversationRepository $conversationRepository)
    {
        $this->conversationRepository = $conversationRepository;
    }

    public function listConversation(Request $request)
    {
        $conversation = $this->conversationRepository->listConversation($request->all());
        return $this->success($conversation, trans('lang::messages.common.getListSuccess'));
    }

    public function synchronizeConversation(Request $request)
    {
        $conversation = $this->conversationRepository->synchronizeConversation($request->all());
        return $this->success((array)$conversation, trans('lang::messages.common.getListSuccess'));
    }
}
