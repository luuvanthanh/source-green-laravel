<?php

namespace GGPHP\Users\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Users\Http\Requests\AssignOrRemoveUserCollectionRequest;
use GGPHP\Users\Http\Requests\RemoveUserCollectionRequest;
use GGPHP\Users\Repositories\Contracts\UserCollectionRepository;
use GGPHP\Users\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UserCollectionController extends Controller
{
    /**
     * @var $userCollectionRepo
     */
    protected $userCollectionRepo;

    /**
     * UserCollectionRepo constructor.
     *
     * @param UserCollectionRepo userCollectionRepo
     */
    public function __construct(UserCollectionRepository $userCollectionRepo)
    {
        $this->userCollectionRepo = $userCollectionRepo;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function assigned(Request $request, $userId)
    {
        $userCollections = $this->userCollectionRepo->assigned($request->all(), $userId);

        return $this->success($userCollections, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function removeUser(RemoveUserCollectionRequest $request)
    {
        \DB::beginTransaction();
        try {
            $this->userCollectionRepo->removeUser($request->users_delete, $request->collection_id);
            \DB::commit();
            return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
        } catch (\Exception $ex) {
            \Log::error($ex);
            \DB::rollback();
        }

        return $this->error([], trans('lang::messages.common.serverError'), Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    /**
     * Add user to collection
     *
     * @param AssignOrRemoveUserCollectionRequest $request
     * @param type $id
     * @return type
     */
    public function assignOrRemoveUser(AssignOrRemoveUserCollectionRequest $request)
    {
        \DB::beginTransaction();
        try {
            $result = $this->userCollectionRepo->assignOrRemoveUser($request->all());
            \DB::commit();
            return $this->success($result, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
        } catch (\Exception $ex) {
            \Log::error($ex);
            \DB::rollback();
        }
        return $this->error([], trans('lang::messages.common.serverError'), Response::HTTP_INTERNAL_SERVER_ERROR);
    }

}
