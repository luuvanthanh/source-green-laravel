<?php

namespace GGPHP\FingerprintTimekeeper\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\FingerprintTimekeeper\Http\Requests\FingerprintTimekeeperCreateRequest;
use GGPHP\FingerprintTimekeeper\Http\Requests\FingerprintTimekeeperUpdateRequest;
use GGPHP\FingerprintTimekeeper\Repositories\Contracts\FingerprintTimekeeperRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Class FingerprintTimekeepersController.
 *
 * @package namespace GGPHP\FingerprintTimekeeper\Http\Controllers;
 */
class FingerprintTimekeeperController extends Controller
{
    /**
     * @var FingerprintTimekeeperRepository
     */
    protected $fingerprintTimekeeperrepository;

    /**
     * FingerprintTimekeepersController constructor.
     *
     * @param FingerprintTimekeeperRepository $repository
     * @param FingerprintTimekeeperValidator $validator
     */
    public function __construct(FingerprintTimekeeperRepository $fingerprintTimekeeperrepository)
    {
        $this->fingerprintTimekeeperrepository = $fingerprintTimekeeperrepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(FingerprintTimekeeperCreateRequest $request)
    {

        $fingerprintTimekeeper = $this->fingerprintTimekeeperrepository->create($request->all());

        return $this->success($fingerprintTimekeeper, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED, 'isShowData' => false]);
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
        $fingerprintTimekeeper = $this->fingerprintTimekeeperrepository->find($id);

        return $this->success($fingerprintTimekeeper, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = config('constants.SEARCH_VALUES_DEFAULT.LIMIT');
        if ($request->has('limit')) {
            $limit = $request->limit;
        }

        if ($limit == config('constants.SEARCH_VALUES_DEFAULT.LIMIT_ZERO')) {
            $fingerprintTimekeeper = $this->fingerprintTimekeeperrepository->all();
        } else {
            $fingerprintTimekeeper = $this->fingerprintTimekeeperrepository->paginate($limit);
        }

        return $this->success($fingerprintTimekeeper, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(FingerprintTimekeeperUpdateRequest $request, $id)
    {
        $fingerprintTimekeeper = $this->fingerprintTimekeeperrepository->update($request->all(), $id);

        return $this->success($fingerprintTimekeeper, trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
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
        $this->fingerprintTimekeeperrepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }
}
