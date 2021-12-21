<?php

namespace GGPHP\Crm\Facebook\Repositories\Eloquent;

use GGPHP\Crm\Facebook\Models\UserFacebookInfoTag;
use GGPHP\Crm\Facebook\Presenters\UserFacebookInfoTagPresenter;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Crm\Facebook\Repositories\Contracts\UserFacebookInfoTagRepository;

/**
 * Class UserFacebookInfoRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class UserFacebookInfoTagRepositoryEloquent extends BaseRepository implements UserFacebookInfoTagRepository
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
        return UserFacebookInfoTag::class;
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
        return UserFacebookInfoTagPresenter::class;
    }

    public function getUserFacebookInfoTag(array $attributes)
    {
        if (!empty($attributes['user_facebook_info_id'])) {
            $this->model = $this->model->where('user_facebook_info_id', $attributes['user_facebook_info_id']);
        }

        if (!empty($attributes['limit'])) {
            $customerTag = $this->paginate($attributes['limit']);
        } else {
            $customerTag = $this->get();
        }

        return $customerTag;
    }

    public function create(array $attributes)
    {
        
        if (!empty($attributes['user_facebook_info_tag'])) {
            UserFacebookInfoTag::where('user_facebook_info_id', $attributes['user_facebook_info_id'])->delete();
            foreach ($attributes['user_facebook_info_tag'] as $value) {
                $value['user_facebook_info_id'] = $attributes['user_facebook_info_id'];
                $userFacebookInfoTag = UserFacebookInfoTag::create($value);
            }
        } else {
            UserFacebookInfoTag::where('user_facebook_info_id', $attributes['user_facebook_info_id'])->delete();
            $userFacebookInfoTag = UserFacebookInfoTag::where('user_facebook_info_id', $attributes['user_facebook_info_id'])->get();
        }

        return parent::parserResult($userFacebookInfoTag);
    }
}
