<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use GGPHP\Approval\Models\ApprovalRequest;
use GGPHP\Division\Models\RankPositionInformation;
use GGPHP\Notifications\Services\ApprovalRequestNotificationService;
use GGPHP\RolePermission\Models\Role;
use GGPHP\Users\Models\User;
use Illuminate\Console\Command;

class WorkBacklogConmmand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'work_backlog';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Notification work backlog';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $roles = Role::whereIn('id', [3, 4, 5])->get();

        foreach ($roles as $role) {
            $users = User::whereHas('roles', function ($query) use ($role) {
                $query->where('id', $role->id);
            })->get();

            foreach ($users as $user) {
                $now = Carbon::now()->format('Y-m-d');
                $rankinfo = RankPositionInformation::where('user_id', $user->id)->where(function ($q) use ($now) {
                    $q->where([['start_date', '<=', $now], ['end_date', '>=', $now]])
                        ->orWhere([['start_date', '<=', $now], ['end_date', null]]);
                })->first();
                $permissionPosition = $rankinfo->position->permissions->pluck('mode_id')->toArray();

                $numberWorkBacklog = ApprovalRequest::whereIn('transition', function ($q) use ($role) {
                    $q->select('from')->from('workflow_transitions')
                        ->join('workflows', 'workflows.id', '=', 'workflow_transitions.workflow_id')
                        ->join('approval_requests', 'workflows.id', '=', 'approval_requests.workflow_id')
                        ->whereJsonContains("workflow_transitions.meta_data->roles", [$role->id])
                        ->whereJsonContains("workflow_transitions.meta_data->is_finished", false)
                        ->where('slug', '!=', 'cancle')
                        ->where('slug', '!=', 'reapprove');
                })->whereDoesntHave('confirmations', function ($q) use ($user) {
                    $q->where('approver_id', $user->id);
                })->whereIn('store_id', $permissionPosition)->count();

                if ($numberWorkBacklog > 0) {
                    ApprovalRequestNotificationService::workBacklog($user, $numberWorkBacklog);
                }

            }

        }

        return 0;
    }
}
