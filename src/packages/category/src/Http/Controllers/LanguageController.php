<?php

namespace GGPHP\Category\Http\Controllers;

use GGPHP\Category\Http\Requests\LanguageCreateRequest;
use GGPHP\Category\Http\Requests\LanguageUpdateRequest;
use GGPHP\Category\Repositories\Contracts\LanguageRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class LanguageController extends Controller
{

    protected $languageRepository;

    public function __construct(LanguageRepository $languageRepository)
    {
        $this->languageRepository = $languageRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $language = $this->languageRepository->getLanguage($request->all());

        return $this->success($language, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(LanguageCreateRequest $request)
    {
        $credentials = $request->all();

        $language = $this->languageRepository->create($credentials);

        return $this->success($language, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $language = $this->languageRepository->find($id);

        return $this->success($language, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(LanguageUpdateRequest $request, $id)
    {
        $credentials = $request->all();

        $language = $this->languageRepository->update($credentials, $id);

        return $this->success($language, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->languageRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
