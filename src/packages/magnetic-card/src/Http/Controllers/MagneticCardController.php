<?php

namespace GGPHP\MagneticCard\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\MagneticCard\Http\Requests\MagneticCardCreateRequest;
use GGPHP\MagneticCard\Http\Requests\MagneticCardUpdateRequest;
use GGPHP\MagneticCard\Repositories\Contracts\MagneticCardRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MagneticCardController extends Controller
{
    /**
     * @var $magneticCardRepository
     */
    protected $magneticCardRepository;

    /**
     * UserController constructor.
     * @param MagneticCardRepository $magneticCardRepository
     */
    public function __construct(MagneticCardRepository $magneticCardRepository)
    {
        $this->magneticCardRepository = $magneticCardRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(MagneticCardCreateRequest $request)
    {
        $magneticCard = $this->magneticCardRepository->create($request->all());

        return $this->success($magneticCard, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $magneticCard = $this->$magneticCardRepository->find($id);

        return $this->success($magneticCard, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $magneticCard = $this->magneticCardRepository->getAll($request->all());

        return $this->success($magneticCard, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(MagneticCardUpdateRequest $request, $id)
    {
        $magneticCard = $this->magneticCardRepository->update($request->all(), $id);

        return $this->success($magneticCard, trans('lang::messages.common.updateSuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->magneticCardRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    /**
     * Restore the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function restore($id)
    {
        $this->magneticCardRepository->restore($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

}
