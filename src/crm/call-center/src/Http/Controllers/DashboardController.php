<?php

namespace GGPHP\Crm\CallCenter\Http\Controllers;

use App\Ticket;
use GGPHP\Core\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $tickets = Ticket::all();
        return view('supportDashboard', ['tickets' => $tickets]);
    }
}
