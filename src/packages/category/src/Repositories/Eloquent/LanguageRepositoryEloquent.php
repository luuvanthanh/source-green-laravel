<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\Language;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Category\Presenters\LanguagePresenter;
use GGPHP\Category\Repositories\Contracts\LanguageRepository;

/**
 * Class LanguageRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class LanguageRepositoryEloquent extends BaseRepository implements LanguageRepository
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
        return Language::class;
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
        return LanguagePresenter::class;
    }

    public function getLanguage(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where('name', 'like', '%' . $attributes['key'] . '%')->orWhere('code', 'like', '%' . $attributes['key'] . '%');
        }

        if (!empty($attributes['limit'])) {
            $language = $this->paginate($attributes['limit']);
        } else {
            $language = $this->get();
        }

        return $language;
    }
}
