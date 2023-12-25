<?php

namespace App\Http\Controllers;

use App\Libraries\Utils\ResponseManager;
use App\Models\Event;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class EventController extends Controller
{
    public function index() {
        $events = Event::orderBy('id', 'DESC')->get();
        $allEvents = array();
        foreach ($events as $key => $value) {
            $allEvents[$key] = $value;
            if($value->recurring != "None") {
               $allEvents[$key]['message'] = "Event will repeat on a ".$value->recurring." basis from ".date('j F Y', strtotime($value->event_date))." to ".date('j F Y', strtotime($value->repeat_end_date))."";
            } else {
                $allEvents[$key]['message'] = "Event is only for the selected time.";
            }
        }
        
        if($events) {
            $data = ['events' => $allEvents];
            return response()->json(ResponseManager::getResponse($data, 200, '', true));
        }else{
            return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
        }
    }

    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'event_name' => 'required',
            'event_color' => 'required',
            'event_date' => 'required',
        ]);
    
        if ($validator->fails()) {
            $data = ['errors' => $validator->errors()];
            return response()->json(ResponseManager::getResponse($data, 422));
        }

        try {
            DB::beginTransaction();
            $inputData = $request->all();
            $event = new Event($request->all());
            $event->recurring = $inputData['recurring'];
            $event->repeat_end_date = (!empty($inputData['repeat_end_date']) && $inputData['recurring'] != "None") ? $inputData['repeat_end_date'] : NULL;
            $event->save();

            if($event) {
                DB::commit();
                $data = ['event' => $event];
                return response()->json(ResponseManager::getResponse($data, 200, 'New event added successfully.', true));
            }else{
                return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
            }
        }catch(Exception $e) {
            DB::rollBack();

            return response()->json(ResponseManager::getResponse('', 200, 'An error occurred, please try later.'));
        }
    }

    public function edit($eventId) {
        $event = Event::find($eventId);

        if(!$event) {
            return response()->json(ResponseManager::getResponse('', 200, 'Event not found.'));
        }

        if($event) {
            $data = ['event' => $event];
            return response()->json(ResponseManager::getResponse($data, 200, '', true));
        }

        return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
    }

    public function update($eventId, Request $request) {
        $validator = Validator::make($request->all(), [
            'event_name' => 'required',
            'event_color' => 'required',
            'event_date' => 'required',
        ]);
    
        if ($validator->fails()) {
            $data = ['errors' => $validator->errors()];
            return response()->json(ResponseManager::getResponse($data, 422));
        }

        $event = Event::find($eventId);
        $inputData = $request->all();
        $event->event_name = $inputData['event_name'];
        $event->event_color = $inputData['event_color'];
        $event->event_date = $inputData['event_date'];
        $event->recurring = $inputData['recurring'];
        $event->repeat_end_date = (!empty($inputData['repeat_end_date']) && $inputData['recurring'] != "None") ? $inputData['repeat_end_date'] : NULL;
        $event->save();
        if($event) {
            $data = ['event' => $event];
            return response()->json(ResponseManager::getResponse($data, 200, 'Event updated successfully.', true));
        }else{
            return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
        }
    }

    public function destroy($eventId) {
        try {
            DB::beginTransaction();
            
            $event = Event::find($eventId);
    
            if(!$event) {
                return response()->json(ResponseManager::getResponse('', 200, 'Event not found.'));
            }
    
            if($event->delete()) {
                DB::commit();
                
                return response()->json(ResponseManager::getResponse('', 200, 'Event deleted successfully.', true));
            } else {
                DB::rollBack();

                return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
            }
        }catch(Exception $e) {
            DB::rollBack();

            return response()->json(ResponseManager::getResponse('', 200, 'An error occurred, please try later.'));
        }
    }

    public function calenderEvents() {
        $events = Event::get()->toArray();
        $finalData = array();
        $i = 0;
        foreach ($events as $key => $value) {
            if($value['recurring'] == "Daily") 
            {
                foreach ($this->getDailyEvents($value) as $rec_key => $event) {
                    $finalData[$i]['id'] = $value['id'];
                    $finalData[$i]['event_name'] = $value['event_name'];
                    $finalData[$i]['event_date'] = $event['event_date'];
                    $finalData[$i]['event_color'] = $value['event_color'];
                    $i++;
                }
            } 
            else if($value['recurring'] == "Weekly")
            {
                foreach ($this->getWeeklyEvents($value) as $rec_key => $event) {
                    $finalData[$i]['id'] = $value['id'];
                    $finalData[$i]['event_name'] = $value['event_name'];
                    $finalData[$i]['event_date'] = $event['event_date'];
                    $finalData[$i]['event_color'] = $value['event_color'];
                    $i++;
                }
            }
            else if($value['recurring'] == "Monthly")
            {
                foreach ($this->getMonthlyEvents($value) as $rec_key => $event) {
                    $finalData[$i]['id'] = $value['id'];
                    $finalData[$i]['event_name'] = $value['event_name'];
                    $finalData[$i]['event_date'] = $event['event_date'];
                    $finalData[$i]['event_color'] = $value['event_color'];
                    $i++;
                }
            }
            else if($value['recurring'] == "Quarterly")
            {
                foreach ($this->getQuaterlyEvents($value) as $rec_key => $event) {
                    $finalData[$i]['id'] = $value['id'];
                    $finalData[$i]['event_name'] = $value['event_name'];
                    $finalData[$i]['event_date'] = $event['event_date'];
                    $finalData[$i]['event_color'] = $value['event_color'];
                    $i++;
                }
            }
            else if($value['recurring'] == "Yearly")
            {
                foreach ($this->getYearlyEvents($value) as $rec_key => $event) {
                    $finalData[$i]['id'] = $value['id'];
                    $finalData[$i]['event_name'] = $value['event_name'];
                    $finalData[$i]['event_date'] = $event['event_date'];
                    $finalData[$i]['event_color'] = $value['event_color'];
                    $i++;
                }
            }
            else
            {
                $finalData[$i]['id'] = $value['id'];
                $finalData[$i]['event_name'] = $value['event_name'];
                $finalData[$i]['event_date'] = $value['event_date'];
                $finalData[$i]['event_color'] = $value['event_color'];
                $i++;
            }
        }

        if($finalData) {
            $data = ['events' => $finalData];
            return response()->json(ResponseManager::getResponse($data, 200, '', true));
        }else{
            return response()->json(ResponseManager::getResponse('', 200, 'Something wrong please try latter.'));
        }
    }

    function getEvent($event, $start, $end)
    {
        $eventData = $event;
        $eventData['event_date'] = $start->format('Y-m-d');
        return $eventData;
    }

    function getDailyEvents($event)
    {
        $end = Carbon::parse($event['repeat_end_date']);
        $start = Carbon::parse($event['event_date']);

        $days = $end->diffInDays($start);

        $events = array();
        $date = $start;
        for ($i = 1; $i <= $days + 1; $i++) {
            $events[] = $this->getEvent($event, $date, $date);
            $date = Carbon::parse($date)->addDays(1);
            if($date->gt($end))
            break;
        }
        return $events;
    }

    function getWeeklyEvents($event)
    {
        $end = Carbon::parse($event['repeat_end_date']);
        $start = Carbon::parse($event['event_date']);

        $weeks = $end->diffInWeeks($start);

        $events = array();
        $date = $start;
        for ($i = 1; $i <= $weeks + 1; $i++) {
            $events[] = $this->getEvent($event, $date, $date);
            $date = Carbon::parse($date)->addWeeks(1);
            if($date->gt($end))
            break;
        }
        return $events;
    }

    function getMonthlyEvents($event)
    {
        $end = Carbon::parse($event['repeat_end_date']);
        $start = Carbon::parse($event['event_date']);

        $months = $end->diffInMonths($start);

        $events = array();
        $date = $start;
        for ($i = 1; $i <= $months + 1; $i++) {
            $events[] = $this->getEvent($event, $date, $date);
            $date = Carbon::parse($date)->addMonths(1);
            if($date->gt($end))
            break;
        }
        return $events;
    }

    function getQuaterlyEvents($event)
    {
        $end = Carbon::parse($event['repeat_end_date']);
        $start = Carbon::parse($event['event_date']);

        $months = $end->diffInMonths($start);

        $events = array();
        $date = $start;
        for ($i = 1; $i <= $months + 1; $i++) {
            $events[] = $this->getEvent($event, $date, $date);
            $date = Carbon::parse($date)->addMonths(3);
            if($date->gt($end))
            break;
        }
        return $events;
    }

    function getYearlyEvents($event)
    {
        $end = Carbon::parse($event['repeat_end_date']);
        $start = Carbon::parse($event['event_date']);

        $years = $end->diffInYears($start);
        $events = array();

        $date = $start;
        for ($i = 1; $i <= $years + 1; $i++) {
            $events[] = $this->getEvent($event, $date, $date);
            $date = Carbon::parse($date)->addYears(1);
            if($date->gt($end))
            break;
        }
        return $events;
    }
}
