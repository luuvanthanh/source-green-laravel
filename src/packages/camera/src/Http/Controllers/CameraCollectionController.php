<?php

namespace GGPHP\Camera\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Camera\Http\Requests\CollectionAddOrDeleteCameraRequest;
use GGPHP\Collection\Repositories\Contracts\CollectionRepository;
use Illuminate\Http\Response;

class CameraCollectionController extends Controller
{

    /**
     * @var $collectionRepository
     */
    protected $collectionRepository;

    /**
     * UserCollectionRepo constructor.
     *
     * @param UserCollectionRepo userCollectionRepo
     */
    public function __construct(CollectionRepository $collectionRepository)
    {
        $this->collectionRepository = $collectionRepository;
    }

    /**
     * Add camera to collection
     *
     * @param CollectionAddCameraRequest $request
     * @param type $id
     * @return type
     */
    public function store(CollectionAddOrDeleteCameraRequest $request)
    {
        $credentials = $request->only(['items_new', 'items_delete']);
        $collectionIds = $request->get('collection_ids');
        \DB::beginTransaction();
        try {
            $cameraCollection = $this->collectionRepository->addOrDeleteCamera($credentials, $collectionIds);
            \DB::commit();
            return $this->success($cameraCollection, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
        } catch (\Exception $ex) {
            \Log::error($ex);
            \DB::rollback();
        }
        return $this->error([], trans('lang::messages.common.serverError'), Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
