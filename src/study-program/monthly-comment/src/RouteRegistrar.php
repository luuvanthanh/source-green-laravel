<?php

namespace GGPHP\StudyProgram\MonthlyComment;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\StudyProgram\MonthlyComment\Http\Controllers';

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forBread();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forBread()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::resource('monthly-comments', 'MonthlyCommentController');
            \Route::post('update-status-monthly-comments', 'MonthlyCommentController@updateStatusMonthlyComment');
            \Route::post('notification-monthly-comments', 'MonthlyCommentController@notificationMonthlyComment');
            \Route::post('update-all-status-monthly-comments', 'MonthlyCommentController@updateAllStatusMonthlyComment');
            \Route::post('notification-all-status-monthly-comments', 'MonthlyCommentController@notificationAllStatusMonthlyComment');
            \Route::delete('delete-monthly-comments/{id}', 'MonthlyCommentController@deleteMonthlyComment');
            \Route::get('count-student-monthly-comment-by-status','MonthlyCommentController@countStudentMonthlyCommentByStatus');
        });
    }
}
