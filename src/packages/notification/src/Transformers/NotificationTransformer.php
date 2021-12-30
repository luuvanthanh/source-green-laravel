<?php

namespace GGPHP\Notification\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Notification\Models\Notification;
use GGPHP\Project\Transformers\ProjectTransformer;
use GGPHP\Users\Transformers\UserTransformer;
use GGPHP\Work\Transformers\WorkTransformer;
use Illuminate\Support\Facades\Auth;

/**
 * Class NotificationTransformer.
 *
 * @package namespace GGPHP\Notification\Transformers;
 */
class NotificationTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['user', 'project', 'work'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customMeta(): array
    {
        $count = 0;
        if (Auth::check()) {
            $userId = Auth::id();
            $count = Notification::where('user_id', $userId)->where('is_read', false)->count();
        }
        return [
            'unread' => $count,
        ];
    }

    /**
     * Include user
     * @param  Notification $notification
     */
    public function includeUser(Notification $notification)
    {
        if (empty($notification->user)) {
            return;
        }
        return $this->item($notification->user, new UserTransformer, 'User');
    }

    /**
     * Include user
     * @param  Notification $notification
     */
    public function includeProject(Notification $notification)
    {
        if (empty($notification->project)) {
            return;
        }
        return $this->item($notification->project, new ProjectTransformer, 'Project');
    }

    /**
     * Include user
     * @param  Notification $notification
     */
    public function includeWork(Notification $notification)
    {
        if (empty($notification->work)) {
            return;
        }
        return $this->item($notification->work, new WorkTransformer, 'Work');
    }
}
