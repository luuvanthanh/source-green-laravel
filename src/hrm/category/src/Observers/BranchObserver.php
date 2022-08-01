<?php

namespace GGPHP\Category\Observers;

use GGPHP\Category\Jobs\CreateBranchCrmJob;
use GGPHP\Category\Jobs\DeleteBranchCrmJob;
use GGPHP\Category\Jobs\UpdateBranchCrmJob;
use GGPHP\Category\Models\Branch;

class BranchObserver
{
    /**
     * Handle the branch "created" event.
     *
     * @param  \App\Branch  $branch
     * @return void
     */
    public function created(Branch $branch)
    {
        dispatch(new CreateBranchCrmJob($this->getToken(), $branch));
    }

    /**
     * Handle the branch "updated" event.
     *
     * @param  \App\Branch  $branch
     * @return void
     */
    public function updated(Branch $branch)
    {
        dispatch(new UpdateBranchCrmJob($this->getToken(), $branch, $branch->BranchIdCrm));
    }

    /**
     * Handle the branch "deleted" event.
     *
     * @param  \App\Branch  $branch
     * @return void
     */
    public function deleted(Branch $branch)
    {
        if (!is_null($branch->BranchIdCrm)) {
            dispatch(new DeleteBranchCrmJob($this->getToken(), $branch->BranchIdCrm));
        }
    }

    /**
     * Handle the branch "restored" event.
     *
     * @param  \App\Branch  $branch
     * @return void
     */
    public function restored(Branch $branch)
    {
        //
    }

    /**
     * Handle the branch "force deleted" event.
     *
     * @param  \App\Branch  $branch
     * @return void
     */
    public function forceDeleted(Branch $branch)
    {
        //
    }

    public function getToken()
    {
        return request()->bearerToken();
    }
}
