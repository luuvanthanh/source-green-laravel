<?php

namespace GGPHP\Collection\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Collection\Http\Requests\CollectionCreateRequest;
use GGPHP\Collection\Http\Requests\CollectionUpdateRequest;
use GGPHP\Collection\Repositories\Contracts\CollectionRepository;
use GGPHP\VideoWall\Repositories\Contracts\VideoWallRepository;
use GGPHP\Collection\Models\Collection;
use GGPHP\VideoWall\Models\VideoWall;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CollectionController extends Controller
{
    /**
     * @var $collectionRepository
     */
    protected $collectionRepository;

    /**
     * @var $collectionRepository
     */
    protected $videoWallRepository;

    /**
     * CollectionController constructor.
     * @param CollectionRepository $collectionRepository
     */
    public function __construct(CollectionRepository $collectionRepository, VideoWallRepository $videoWallRepository)
    {
        $this->collectionRepository = $collectionRepository;
        $this->videoWallRepository = $videoWallRepository;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $collections = $this->collectionRepository->getCollection($request->all());

        return $this->success($collections, trans('lang::messages.common.getListSuccess'));
    }

    /**
     *
     * @param CollectionCreateRequest $request
     *
     * @return Response
     */
    public function store(CollectionCreateRequest $request)
    {
        $credentials = $request->all();
        $collection = $this->collectionRepository->create($credentials);

        return $this->success($collection, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * @param Request $request
     * @param $id
     * @return Response
     */
    public function show(Request $request, $id)
    {
        $collection = $this->collectionRepository->find($id);

        return $this->success($collection, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     *
     * @param CollectionUpdateRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(CollectionUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $collection = $this->collectionRepository->update($credentials, $id);

        return $this->success($collection, trans('lang::messages.common.modifySuccess'));
    }

    /**
     *
     * @param  int $id
     *
     * @return Response
     */
    public function destroy(Collection $collection)
    {
        if ($this->collectionRepository->delete($collection)) {
            return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
        }

        return response()->json(null, 422);
    }

    public function addVideoWall(Collection $collection)
    {
        $data = [
            'name' => !empty($collection->name) ? substr($collection->name, 0, 20) : null,
            'display_type' => VideoWall::TYPE_2X2,
            'user_id' => auth()->user()->id
        ];
        $videoWall = VideoWall::create($data);

        if ($videoWall) {
            $cameras = $collection->camera->pluck('id');
            $dataCamera = [];
            foreach ($cameras as $key => $camera) {
                $dataCamera[$camera] = ['priority' => $key + 1];
            }

            if (!empty($dataCamera)) {
                $videoWall->cameras()->sync($dataCamera);
            }
        }

        return $this->success($this->videoWallRepository->parserResult($videoWall), trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);

    }

}
