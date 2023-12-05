<?php

namespace App\Http\Controllers;

use App\Libraries\Utils\ResponseManager;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index() {
        try {
            $user = Auth::user();

            $totalUsers = User::count();
            $totalActiveUsers = User::where('is_active', 'Active')
                                    ->count();
            $totalInactiveUsers = User::where('is_active', 'In Active')
                                    ->count();
            
            $totalUsersCreatedBy = User::where('created_by', $user->id)
                                        ->count();
            $totalActiveUsersCreatedBy = User::where('created_by', $user->id)
                                            ->where('is_active', 'Active')
                                            ->count();
            $totalInactiveUsersCreatedBy = User::where('created_by', $user->id)
                                                ->where('is_active', 'In Active')
                                                ->count();

            $totalRoles = Role::count();
            $totalActiveRoles = Role::where('is_active', 'Active')
                                    ->count();
            $totalInactiveRoles = Role::where('is_active', 'In Active')
                                    ->count();

            $totalRolesCreatedBy = Role::where('created_by', $user->id)
                                    ->count();
            $totalActiveRolesCreatedBy = Role::where('created_by', $user->id)
                                        ->where('is_active', 'Active')
                                        ->count();
            $totalInactiveRolesCreatedBy = Role::where('created_by', $user->id)
                                            ->where('is_active', 'In Active')
                                            ->count();

            $endDate = Carbon::yesterday();
            $startDate = $endDate->copy()->subDays(6);
            
            // Create an array with all dates in the last 7 days
            $dateRange = [];
            $currentDate = $startDate->copy();
            while ($currentDate <= $endDate) {
                $dateRange[] = $currentDate->toDateString();
                $currentDate->addDay();
            }

            $dailyTotalUsersData = User::whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate)
                ->selectRaw('DATE(created_at) as date, COUNT(*) as user_count')
                ->groupBy('date')
                ->get();
            
            // Initialize the result array with 0 counts for all dates
            $dailyTotalUsers = [];
            foreach ($dateRange as $date) {
                $day = Carbon::parse($date);
                $dayName = $day->format('D');
                
                $record = $dailyTotalUsersData->where('date', $date)->first();
                
                $dailyTotalUsers[] = [
                    'day' => $dayName,
                    'date' => $day->toDateString(),
                    'count' => $record ? $record->user_count : 0,
                ];
            }

            $data = [
                'totalUsers' => $totalUsers,
                'totalActiveUsers' => $totalActiveUsers,
                'totalInactiveUsers' => $totalInactiveUsers,
                
                'totalUsersCreatedBy' => $totalUsersCreatedBy,
                'totalActiveUsersCreatedBy' => $totalActiveUsersCreatedBy,
                'totalInactiveUsersCreatedBy' => $totalInactiveUsersCreatedBy,

                'totalRoles' => $totalRoles,
                'totalActiveRoles' => $totalActiveRoles,
                'totalInactiveRoles' => $totalInactiveRoles,

                'totalRolesCreatedBy' => $totalRolesCreatedBy,
                'totalActiveRolesCreatedBy' => $totalActiveRolesCreatedBy,
                'totalInactiveRolesCreatedBy' => $totalInactiveRolesCreatedBy,

                'dailyTotalUsers' => $dailyTotalUsers
            ];
            return response()->json(ResponseManager::getResponse($data, 200, '', true));
        }catch(Exception $e) {
            return response()->json(ResponseManager::getResponse('', 200, 'An error occurred, please try later.'));
        }
    }
}
