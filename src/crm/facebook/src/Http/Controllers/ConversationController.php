<?php

namespace GGPHP\Crm\Facebook\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Facebook\Jobs\SynchronizeConversation;
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

    public function index(Request $request)
    {
        $conversation = $this->conversationRepository->getConversation($request->all());
        return $this->success($conversation, trans('lang::messages.common.getListSuccess'));
    }

    public function synchronizeConversation(Request $request)
    {
        dispatch(new SynchronizeConversation($request->all()));
        return $this->success([], trans('lang::messages.common.getListSuccess'));
    }

    public function seenConversation(Request $request)
    {
        $conversation = $this->conversationRepository->seenConversation($request->all());
        return $this->success([], trans('lang::messages.common.getListSuccess'));
    }
}
