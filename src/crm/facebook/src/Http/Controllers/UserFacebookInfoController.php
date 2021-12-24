<?php

namespace GGPHP\Crm\Facebook\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\CustomerLead\Models\StudentInfo;
use GGPHP\Crm\Facebook\Http\Requests\AddLeadRequest;
use GGPHP\Crm\Facebook\Models\UserFacebookInfo;
use GGPHP\Crm\Facebook\Repositories\Contracts\UserFacebookInfoRepository;
use Illuminate\Http\Request;

class UserFacebookInfoController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $userFacebookInfoRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(UserFacebookInfoRepository $userFacebookInfoRepository)
    {
        $this->userFacebookInfoRepository = $userFacebookInfoRepository;
    }
    public function index(Request $request)
    {
        $userFacebookInfo = $this->userFacebookInfoRepository->getUserFacebookInfo($request->all());
        return $this->success($userFacebookInfo, trans('lang::messages.common.getListSuccess'));
    }

    public function addLead(AddLeadRequest $request)
    {
        $attributes = $request->all();
        if (!empty($attributes['sex'])) {
            $attributes['sex'] = UserFacebookInfo::SEX[$attributes['sex']];
        }
        if (!empty($attributes['student_info'])) {
            foreach ($attributes['student_info'] as $key => $value) {
                $attributes['student_info'][$key]['sex'] = StudentInfo::SEX[$value['sex']];
            }
        }
        $userFacebookInfo = $this->userFacebookInfoRepository->addLead($attributes);
        return $this->success($userFacebookInfo, trans('lang::messages.common.createSuccess'));
    }

    public function update(Request $request, $id)
    {
        $credentials = $request->all();

        $userFacebookInfo = $this->userFacebookInfoRepository->update($credentials, $id);

        return $this->success($userFacebookInfo, trans('lang::messages.common.modifySuccess'));
    }

    public function specifyConversation(Request $request)
    {
        $this->userFacebookInfoRepository->specifyConversation($request->all());

        return $this->success([], trans('Chỉ định cuộc trò chuyện thành công'));
    }

    public function deleteSpecifyConversation(Request $request)
    {
        $this->userFacebookInfoRepository->deleteSpecifyConversation($request->all());

        return $this->success([], trans('Bỏ chỉ định cuộc trò chuyện thành công'));
    }
}
