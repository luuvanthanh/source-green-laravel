<?php

namespace GGPHP\Crm\Facebook\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Crm\Category\Models\SearchSource;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use GGPHP\Crm\CustomerLead\Models\StatusLead;
use GGPHP\Crm\CustomerLead\Models\StudentInfo;
use GGPHP\Crm\Facebook\Models\UserFacebookInfo;
use GGPHP\Crm\Facebook\Presenters\UserFacebookInfoPresenter;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Crm\Facebook\Repositories\Contracts\UserFacebookInfoRepository;

/**
 * Class UserFacebookInfoRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class UserFacebookInfoRepositoryEloquent extends BaseRepository implements UserFacebookInfoRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at',
    ];
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return UserFacebookInfo::class;
    }



    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function presenter()
    {
        return UserFacebookInfoPresenter::class;
    }
    public function getUserFacebookInfo($attributes)
    {
        if (!empty($attributes['conversation_id'])) {
            $this->model = $this->model->whereHas('conversation', function ($query) use ($attributes) {
                $query->where('id', $attributes['conversation_id']);
            });
        }

        if (!empty($attributes['limit'])) {
            $userFacebookInfo = $this->paginate($attributes['limit']);
        } else {
            $userFacebookInfo = $this->get();
        }

        return $userFacebookInfo;
    }
    public function addLead($attributes)
    {
        \DB::beginTransaction();
        try {
            $userFacebookInfo = UserFacebookInfo::find($attributes['user_facebook_info_id']);
            $userFacebookInfo->update($attributes);
            $now = Carbon::now()->setTimezone('GMT+7')->format('Ymd');
            $customerLead_code = CustomerLead::max('code');

            if (is_null($customerLead_code)) {
                $code = CustomerLead::CODE . $now . '01';
            } else {

                if (substr($customerLead_code, 2, 8)  != $now) {
                    $code = CustomerLead::CODE . $now . '01';
                } else {
                    $stt = substr($customerLead_code, 2) + 1;
                    $code = CustomerLead::CODE . $stt;
                }
            }
            $searchSource = SearchSource::whereLike('type', SearchSource::FANPAGE)->first();

            $dataLead = [
                'code' => $code,
                'full_name' => $userFacebookInfo->user_full_name,
                'birth_date' => $userFacebookInfo->user_birth_date,
                'sex' => $userFacebookInfo->sex,
                'email' => $userFacebookInfo->user_email,
                'phone' => $userFacebookInfo->user_phone,
                'address' => $userFacebookInfo->user_address,
                'search_source_id' => $searchSource->id
            ];
            $customerLead = CustomerLead::create($dataLead);
            $dataStatusLead = [
                'customer_lead_id' => $customerLead->id,
                'status' => StatusLead::STATUS_LEAD['LEAD_NEW']
            ];
            StatusLead::create($dataStatusLead);
            foreach ($attributes['student_info'] as $key => $value) {
                $value['customer_lead_id'] = $customerLead->id;
                StudentInfo::create($value);
            }
            $dataUserFacebookInfo = [
                'customer_lead_id' => $customerLead->id,
                'status' => UserFacebookInfo::STATUS['LEAD']
            ];
            $userFacebookInfo->update($dataUserFacebookInfo);

            \DB::commit();
        } catch (\Throwable $th) {
            dd($th);
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($userFacebookInfo);
    }

    public function specifyConversation($attributes)
    {
        $userFacebookInfo = UserFacebookInfo::where('id', $attributes['user_facebook_info_id'])->first();
        if (!is_null($userFacebookInfo)) {
            $userFacebookInfo->update(['employee_facebook_id' => $attributes['employee_facebook_id']]);
        }
        return $userFacebookInfo;
    }

    public function deleteSpecifyConversation($attributes)
    {
        $userFacebookInfo = UserFacebookInfo::where('id', $attributes['user_facebook_info_id'])->where('employee_facebook_id', $attributes['employee_facebook_id'])->first();
        if (!is_null($userFacebookInfo)) {
            $userFacebookInfo->update(['employee_facebook_id' => null]);
        }
        return $userFacebookInfo;
    }
}
