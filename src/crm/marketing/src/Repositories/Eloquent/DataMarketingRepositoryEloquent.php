<?php

namespace GGPHP\Crm\Marketing\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Crm\Category\Models\SearchSource;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use GGPHP\Crm\CustomerLead\Models\StatusLead;
use GGPHP\Crm\CustomerLead\Models\StudentInfo;
use GGPHP\Crm\Marketing\Models\DataMarketing;
use GGPHP\Crm\Marketing\Models\DataMarketingProgram;
use GGPHP\Crm\Marketing\Models\DataMarketingStudentInfo;
use GGPHP\Crm\Marketing\Models\MarketingProgram;
use GGPHP\Crm\Marketing\Presenters\DataMarketingPresenter;
use GGPHP\Crm\Marketing\Repositories\Contracts\DataMarketingRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class MarketingRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class DataMarketingRepositoryEloquent extends BaseRepository implements DataMarketingRepository
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
        return DataMarketing::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return DataMarketingPresenter::class;
    }

    public function getDataMarketing(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('full_name', $attributes['key'])
                ->orWhereLike('phone', $attributes['key'])->orWhereLike('email', $attributes['key']);
        }

        if (!empty($attributes['search_source_id'])) {
            $this->model = $this->model->where('search_source_id', $attributes['search_source_id']);
        }

        if (!empty($attributes['marketing_program_id'])) {
            $this->model = $this->model->whereIn('id', function ($query) use ($attributes) {
                $query->select('data_marketing_program.data_marketing_id')->from('data_marketing_program')->where('marketing_program_id', $attributes['marketing_program_id'])->get();
            });
        }

        if (!empty($attributes['data_marketing_id'])) {
            $dataMarketing = explode(',', $attributes['data_marketing_id']);
            $this->model = $this->model->whereIn('id', $dataMarketing);
        }

        if (!empty($attributes['tag_id'])) {
            $this->model = $this->model->whereHas('tag', function ($query) use ($attributes) {
                $query->where('id', $attributes['tag_id']);
            });
        }

        if (!empty($attributes['full_name']) && $attributes['full_name'] == 'true') {
            $this->model = $this->model->whereIn('full_name', function ($query) {
                $query->select('data_marketings.full_name')->from('data_marketings')->groupBy('data_marketings.full_name')->havingRaw('count(*) > 1');
            });
        }

        if (!empty($attributes['email']) && $attributes['email'] == 'true') {
            $this->model = $this->model->orWhereIn('email', function ($query) {
                $query->select('data_marketings.email')->from('data_marketings')->groupBy('data_marketings.email')->havingRaw('count(*) > 1');
            });
        }

        if (!empty($attributes['address']) && $attributes['address'] == 'true') {
            $this->model = $this->model->orWhereIn('address', function ($query) {
                $query->select('data_marketings.address')->from('data_marketings')->groupBy('data_marketings.address')->havingRaw('count(*) > 1');
            });
        }

        if (!empty($attributes['phone']) && $attributes['phone'] == 'true') {
            $this->model = $this->model->orWhereIn('phone', function ($query) {
                $query->select('data_marketings.phone')->from('data_marketings')->groupBy('data_marketings.phone')->havingRaw('count(*) > 1');
            });
        }

        if (!empty($attributes['children_full_name']) && $attributes['children_full_name'] == 'true') {
            $this->model = $this->model->orWhereHas('studentInfo', function ($query) {
                $query->whereIn('full_name', function ($q) {
                    $q->select('data_marketing_student_infos.full_name')->from('data_marketing_student_infos')->groupBy('data_marketing_student_infos.full_name')->havingRaw('count(*) > 1');
                });
            });
        }

        if (!empty($attributes['children_birth_date']) && $attributes['children_birth_date'] == 'true') {
            $this->model = $this->model->orWhereHas('studentInfo', function ($query) {
                $query->whereIn('birth_date', function ($q) {
                    $q->select('data_marketing_student_infos.birth_date')->from('data_marketing_student_infos')->groupBy('data_marketing_student_infos.birth_date')->havingRaw('count(*) > 1');
                });
            });
        }

        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->whereDate('created_at', '>=', $attributes['start_date'])->whereDate('created_at', '<=', $attributes['end_date']);
        }

        if (!empty($attributes['limit'])) {
            $dataMarketing = $this->paginate($attributes['limit']);
        } else {
            $dataMarketing = $this->get();
        }

        return $dataMarketing;
    }

    public function create(array $attributes)
    {
        $now = Carbon::now()->setTimezone('GMT+7')->format('Ymd');
        $data_marketing_code = DataMarketing::max('code');

        if (is_null($data_marketing_code)) {
            $attributes['code'] = DataMarketing::CODE . $now . '01';
        } else {

            if (substr($data_marketing_code, 2, 8)  != $now) {
                $attributes['code'] = DataMarketing::CODE . $now . '01';
            } else {
                $stt = substr($data_marketing_code, 2) + 1;
                $attributes['code'] = DataMarketing::CODE . $stt;
            }
        }
        $attributes['status'] = DataMarketing::STATUS['NOT_MOVE'];

        $dataMarketing = DataMarketing::create($attributes);

        return $this->parserResult($dataMarketing);
    }

    public function storeProgram($attributes)
    {
        $dataMarketing = DataMarketing::find($attributes['data_marketing_id']);
        $dataMarketing->marketingProgram()->attach($attributes['marketing_program_id']);

        return parent::parserResult($dataMarketing);
    }

    public function deleteProgram($attributes)
    {
        DataMarketingProgram::where('data_marketing_id', $attributes['data_marketing_id'])->where('marketing_program_id', $attributes['marketing_program_id'])->delete();

        return null;
    }

    public function moveLead($attributes)
    {
        $dataMarketing = DataMarketing::whereIn('id', $attributes['data_marketing_id'])->where('status', DataMarketing::STATUS['NOT_MOVE'])->get();
        foreach ($dataMarketing as $key => $value) {
            $data = [
                'code' => $value->code,
                'full_name' => $value->full_name,
                'birth_date' => $value->birth_date,
                'sex' => $value->sex,
                'email' => $value->email,
                'phone' => $value->phone,
                'other_phone' => $value->other_phone,
                'address' => $value->address,
                'city_id' => $value->city_id,
                'district_id' => $value->district_id,
                'facility_id' => $value->facility_id,
                'user_create_id' => $value->user_create_id,
                'user_create_info' => $value->user_create_info,
                'search_source_id' => $value->search_source_id,
                'facebook' => $value->facebook,
                'zalo' => $value->zalo,
                'instagram' => $value->instagram,
                'skype' => $value->skype,
                'name_company' => $value->name_company,
                'address_company' => $value->address_company,
                'phone_company' => $value->phone_company,
                'career' => $value->career,
                'file_image' => $value->file_image,
                'branch_id' => $value->branch_id,
                'town_ward_id' => $value->town_ward_id
            ];
            $CustomerLead = CustomerLead::create($data);
            $value->update(['status' => DataMarketing::STATUS['MOVE']]);

            $dataStatusLead = [
                'customer_lead_id' => $CustomerLead->id,
                'status' => StatusLead::STATUS_LEAD['LEAD_NEW']
            ];
            StatusLead::create($dataStatusLead);
            $studentInfo = DataMarketingStudentInfo::where('data_marketing_id', $value->id)->get();
            foreach ($studentInfo as $key => $values) {
                $dataStudent = [
                    'full_name' => $values->full_name,
                    'birth_date' => $values->birth_date,
                    'sex' => $values->sex,
                    'month_age' => $values->month_age,
                    'customer_lead_id' => $CustomerLead->id,
                    'file_image' => $values->file_image,
                    'category_relationship_id' => $values->category_relationship_id
                ];
                StudentInfo::create($dataStudent);
            }
        }

        return parent::parserResult($dataMarketing);
    }

    public function delete($id)
    {
        $dataMarketing = DataMarketing::find($id);
        $dataMarketing->marketingProgram()->detach();
        $dataMarketing->delete();

        return null;
    }

    public function syncDataAuto(array $attributes)
    {
        $now = Carbon::now()->setTimezone('GMT+7')->format('Ymd');
        $data_marketing_code = DataMarketing::max('code');

        if (is_null($data_marketing_code)) {
            $attributes['code'] = DataMarketing::CODE . $now . '01';
        } else {

            if (substr($data_marketing_code, 2, 8)  != $now) {
                $attributes['code'] = DataMarketing::CODE . $now . '01';
            } else {
                $stt = substr($data_marketing_code, 2) + 1;
                $attributes['code'] = DataMarketing::CODE . $stt;
            }
        }
        $attributes['status'] = DataMarketing::STATUS['NOT_MOVE'];
        $userId = $attributes['value']['from']['id'];
        $dataMarketing = DataMarketing::where('user_facebook_id', $userId)->first();

        if (is_null($dataMarketing)) {
            if (isset($attributes['value']['from']['name'])) {
                $searchSource = SearchSource::where('type', SearchSource::FANPAGE)->first();
                $attributes['search_source_id'] = $searchSource->id;
                $attributes['user_facebook_id'] = $userId;
                $attributes['full_name'] = $attributes['value']['from']['name'];
                $dataMarketing = DataMarketing::create($attributes);
                $marketingProgram = MarketingProgram::whereHas('article', function ($query) use ($attributes) {
                    $query->whereHas('postFacebookInfo', function ($q) use ($attributes) {
                        $q->where('facebook_post_id', $attributes['value']['post_id']);
                    });
                })->first();
                $dataMarketingProgram = DataMarketingProgram::where('data_marketing_id', $dataMarketing->id)->where('marketing_program_id', $marketingProgram->id)->first();
                if (is_null($dataMarketingProgram)) {
                    $dataMarketing->marketingProgram()->attach($marketingProgram->id);
                }
            }
        } else {
            $marketingProgram = MarketingProgram::whereHas('article', function ($query) use ($attributes) {
                $query->whereHas('postFacebookInfo', function ($q) use ($attributes) {
                    $q->where('facebook_post_id', $attributes['value']['post_id']);
                });
            })->first();
            $dataMarketingProgram = DataMarketingProgram::where('data_marketing_id', $dataMarketing->id)->where('marketing_program_id', $marketingProgram->id)->first();
            if (is_null($dataMarketingProgram)) {
                $dataMarketing->marketingProgram()->attach($marketingProgram->id);
            }
        }
    }

    public function createTag(array $attributes)
    {
        $dataMarketing = DataMarketing::find($attributes['data_marketing_id']);

        if (!is_null($dataMarketing)) {
            $dataMarketing->tag()->detach();
            $dataMarketing->tag()->attach($attributes['tag_id']);
        }

        return parent::find($dataMarketing->id);
    }

    public function mergeDataMarketing(array $attributes)
    {
        $dataMarketing = DataMarketing::whereIn('id', $attributes['merge_data_marketing_id'])->orWhere('status', DataMarketing::STATUS['MOVE'])->orderBy('created_at', 'DESC')->first();
        $dataMarketing->update($attributes);

        if (!empty($attributes['studen_info'])) {
            if (!empty($dataMarketing->studentInfo)) {
                $dataMarketing->studentInfo()->forceDelete();
            }
            foreach ($attributes['studen_info'] as $value) {
                $value['data_marketing_id'] = $dataMarketing->id;
                DataMarketingStudentInfo::create($value);
            }
        }

        DataMarketing::whereIn('id', $attributes['merge_data_marketing_id'])->where('id', '!=', $dataMarketing->id)->forceDelete();

        return parent::parserResult($dataMarketing);
    }

    //Hoán đổi email và số điện thoại
    public function exchangeEmailPhone()
    {
        $dataMarketing = DataMarketing::get();
        foreach ($dataMarketing as $key => $value) {
            if (!is_null($value->email) && !filter_var($value->email, FILTER_VALIDATE_EMAIL) && is_null($value->phone)) {
                $newPhone = $value->email;
                $newEmail = $value->phone;
                $data = [
                    'phone' => $newPhone,
                    'email' => $newEmail
                ];

                $value->update($data);
            }
        }

        return parent::parserResult($dataMarketing);
    }

    public function multipleDeleteDataMarketing(array $attributes)
    {
        DataMarketing::whereIn('id', $attributes['data'])->forceDelete();

        return parent::parserResult($this->model->first());
    }

    public function mergeMultipleDataMarketing($attributes)
    {
        $dataMarketingDuplicateEmails = $this->model->whereIn('id', $attributes['id'])->whereIn('email', function ($query) {
            $query->select('data_marketings.email')->from('data_marketings')->where('deleted_at', null)->where('status', DataMarketing::STATUS['NOT_MOVE'])->groupBy('data_marketings.email')->havingRaw('count(*) > 1');
        })->where('status', DataMarketing::STATUS['NOT_MOVE'])->orderBy('email')->orderBy('created_at', 'DESC')->get();

        if (!empty($dataMarketingDuplicateEmails)) {
            $this->handleDataMarketing($dataMarketingDuplicateEmails, $action = 'email');
        }

        $dataMarketingDuplicatePhones = $this->model->whereIn('id', $attributes['id'])->whereIn('phone', function ($query) use ($attributes) {
            $query->select('data_marketings.phone')->from('data_marketings')->where('deleted_at', null)->where('status', DataMarketing::STATUS['NOT_MOVE'])->groupBy('data_marketings.phone')->havingRaw('count(*) > 1');
        })->where('status', DataMarketing::STATUS['NOT_MOVE'])->orderBy('phone')->orderBy('created_at', 'DESC')->get();

        if (!empty($dataMarketingDuplicatePhones)) {
            $this->handleDataMarketing($dataMarketingDuplicatePhones, $action = 'phone');
        }

        return null;
    }

    public function handleDataMarketing($attributes, $action)
    {
        if ($action == 'email') {
            $attributes = $attributes->groupBy(function ($item) {
                return $item->email;
            })->map->sortByDesc('created_at');
        } elseif ($action == 'phone') {
            $attributes = $attributes->groupBy(function ($item) {
                return $item->phone;
            })->map->sortByDesc('created_at');
        }

        foreach ($attributes as $dataMarketingDuplicate) {
            foreach ($dataMarketingDuplicate as  $dataMarketing) {
                $arrayDataMarketingId[] = $dataMarketing->id;
            }
            $dataStudents = $this->dataStudent($arrayDataMarketingId);
            $this->storeDataMarketing($arrayDataMarketingId, $dataStudents, $action);
            $arrayDataMarketingId = [];
            $dataStudents = [];
        }
    }

    public function storeDataMarketing($arrayDataMarketingId, $dataStudents, $action)
    {
        $dataMarketing = DataMarketing::whereIn('id', $arrayDataMarketingId)->orderBy('created_at', 'DESC')->first();

        if ($action == 'email') {
            $phoneDataMarketing = DataMarketing::whereIn('id', $arrayDataMarketingId)->where('id', '!=', $dataMarketing->id)->where('phone', '!=', $dataMarketing->phone)->orderBy('created_at', 'DESC')->first();

            if (is_null($dataMarketing->phone) && !is_null($phoneDataMarketing)) {
                $dataMarketing->update(['phone' => $phoneDataMarketing->phone]);
            } elseif (!is_null($phoneDataMarketing)) {
                $dataMarketing->update(['other_phone' => $phoneDataMarketing->phone]);
            }
        } elseif ($action == 'phone') {
            $emailDataMarketing = DataMarketing::whereIn('id', $arrayDataMarketingId)->where('id', '!=', $dataMarketing->id)->where('email', '!=', null)->orderBy('created_at', 'DESC')->first();

            if (!is_null($emailDataMarketing) && is_null($dataMarketing->email)) {
                $dataMarketing->update(['email' => $emailDataMarketing->email]);
            }
        }

        $dataMarketings = DataMarketing::whereIn('id', $arrayDataMarketingId)->where('id', '!=', $dataMarketing->id)->orderBy('created_at', 'asc')->get();

        foreach ($dataMarketings as $key => $value) {
            $data = [
                'birth_date' => is_null($dataMarketing->birth_date) ? $value->birth_date : $dataMarketing->birth_date,
                'sex' => is_null($dataMarketing->sex) ? $value->sex : $dataMarketing->sex,
                'address' => is_null($dataMarketing->address) ? $value->address : $dataMarketing->address,
                'city_id' => is_null($dataMarketing->city_id) ? $value->city_id : $dataMarketing->city_id,
                'district_id' => is_null($dataMarketing->district_id) ? $value->district_id : $dataMarketing->district_id,
                'facility_id' => is_null($dataMarketing->facility_id) ? $value->facility_id : $dataMarketing->facility_id,
                'user_create_id' => is_null($dataMarketing->user_create_id) ? $value->user_create_id : $dataMarketing->user_create_id,
                'user_create_info' => is_null($dataMarketing->user_create_info) ? $value->user_create_info : $dataMarketing->user_create_info,
                'search_source_id' => is_null($dataMarketing->search_source_id) ? $value->search_source_id : $dataMarketing->search_source_id,
                'facebook' => is_null($dataMarketing->facebook) ? $value->facebook : $dataMarketing->facebook,
                'zalo' => is_null($dataMarketing->zalo) ? $value->zalo : $dataMarketing->zalo,
                'instagram' => is_null($dataMarketing->instagram) ? $value->instagram : $dataMarketing->instagram,
                'skype' => is_null($dataMarketing->skype) ? $value->skype : $dataMarketing->skype,
                'name_company' => is_null($dataMarketing->name_company) ? $value->name_company : $dataMarketing->name_company,
                'address_company' => is_null($dataMarketing->address_company) ? $value->address_company : $dataMarketing->address_company,
                'phone_company' => is_null($dataMarketing->phone_company) ? $value->phone_company : $dataMarketing->phone_company,
                'career' => is_null($dataMarketing->career) ? $value->career : $dataMarketing->career,
                'file_image' => is_null($dataMarketing->file_image) ? $value->file_image : $dataMarketing->file_image,
                'branch_id' => is_null($dataMarketing->branch_id) ? $value->branch_id : $dataMarketing->branch_id,
                'town_ward_id' => is_null($dataMarketing->town_ward_id) ? $value->town_ward_id : $dataMarketing->town_ward_id,
                'note' => is_null($dataMarketing->note) ? $value->note : $dataMarketing->note,
            ];
        }

        $dataMarketing->update($data);

        if (!empty($dataStudents)) {
            $dataMarketing->studentInfo()->forceDelete();
            foreach ($dataStudents as $dataStudent) {
                foreach ($dataStudent as $value) {
                    $value['data_marketing_id'] = $dataMarketing->id;
                    DataMarketingStudentInfo::create($value);
                }
            }
        }

        DataMarketing::whereIn('id', $arrayDataMarketingId)->where('id', '!=', $dataMarketing->id)->forceDelete();
    }

    public function dataStudent($arrayDataMarketingId)
    {
        $data = [];
        $dataMarketings = DataMarketing::whereIn('id', $arrayDataMarketingId)->get();
        foreach ($dataMarketings as $key => $dataMarketing) {
            $student = $dataMarketing->studentInfo;
            if (!empty($student)) {
                $dataStudent = $student->map->only('full_name', 'birth_date', 'sex', 'file_image', 'category_relationship_id')->toArray();

                if (!empty($dataStudent)) {
                    $data[] = $dataStudent;
                }
            }
        }

        return $data;
    }
}
