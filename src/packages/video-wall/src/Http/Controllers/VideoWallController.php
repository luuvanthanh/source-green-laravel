<?php

namespace GGPHP\VideoWall\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\VideoWall\Http\Requests\VideoWallCreateRequest;
use GGPHP\VideoWall\Http\Requests\VideoWallUpdateRequest;
use GGPHP\VideoWall\Repositories\Contracts\VideoWallRepository;
use  GGPHP\VideoWall\Models\VideoWall;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class VideoWallController extends Controller
{
    /**
     * @var $videoWallrRepository
     */
    protected $videoWallrRepository;

    /**
     * VideoWallController constructor.
     * @param VideoWallRepository $VideoWallRepository
     */
    public function __construct(VideoWallRepository $videoWallRepository)
    {
        $this->videoWallRepository = $videoWallRepository;
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $videoWalls = $this->videoWallRepository->getVideoWalls($request->all());

        return $this->success($videoWalls, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * @param Request $request
     * @param  VideoWall $videoWall
     * @return Response
     */
    public function show(Request $request, VideoWall $videoWall)
    {
        $videoWall = $this->videoWallRepository->parserResult($videoWall);

        return $this->success($videoWall, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     *
     * @param VideoWallCreateRequest $request
     *
     * @return Response
     */
    public function store(VideoWallCreateRequest $request)
    {

        $attributes = $request->all();

        if (!empty($attributes['display_type'])) {
            $attributes['display_type'] = VideoWall::DISPLAY_TYPE[$attributes['display_type']];
        }

        $videoWalls = $this->videoWallRepository->create($attributes);

        return $this->success($videoWalls, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     *
     * @param VideoWallUpdateRequest $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(VideoWallUpdateRequest $request, VideoWall $videoWall)
    {
        $attributes = $request->all();

        if (!empty($attributes['display_type'])) {
            $attributes['display_type'] = VideoWall::DISPLAY_TYPE[$attributes['display_type']];
        }

        $videoWall =  $this->videoWallRepository->update($attributes, $videoWall);

        return $this->success($videoWall, trans('lang::messages.common.modifySuccess'));
    }

    /**
     *
     * @param VideoWall $videoWall
     *
     * @return Response
     */
    public function destroy($id)
    {
        if ($this->videoWallRepository->delete($id)) {
            return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
        }

        return response()->json(null, Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    public function addCameraToVideoWall(Request  $request, $id)
    {
        $attributes = $request->all();

        $videoWall =  $this->videoWallRepository->addCameraToVideoWall($attributes, $id);

        return $this->success($videoWall, trans('lang::messages.common.modifySuccess'));
    }
}
