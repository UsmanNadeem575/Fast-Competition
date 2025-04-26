<?php

namespace App\Http\Controllers;

use App\Models\Mood;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function store(Request $request)
    {
        $task = Task::create([
            'user_id'   => $request->user_id,
            'title'     => $request->title,
            'due_date'  => $request->due_date, 
            'category'  => $request->category,
            'priority'  => $request->priority,
        ]);
    
        if ($task) {
            return response()->json(['message' => 'Success'], 200);  // Fixed response format
        } else {
            return response()->json(['message' => 'Failed to store task'], 400);  // Fixed response format
        }
    }


    public function index(Request $request)
    {
        // $tasks = Task::all();
        // return response()->json(['data' => $tasks]);

        $userId = $request->user_id;

        // Retrieve the user's mood
        $mood = Mood::where('user_id', $userId)->orderBy('created_at', 'desc')->first();

        // Fetch tasks for the user
        $tasks = Task::where('user_id', $userId)->get();

        return response()->json([
            'mood' => $mood,  // Return mood (default to neutral if not found)
            'data' => $tasks,
        ]);
    }
}



        // // Validate incoming request
        // $validated = $request->validate([
        //     'user_id'   => 'required|exists:signups,id', // Validate user_id exists in the signups table
        //     'title'     => 'required|string|max:255', // Validate title
        //     'due_date'  => 'required|date', // Validate due_date as a proper date
        //     'category'  => 'required|string|max:255', // Validate category
        //     'priority'  => 'required|string|max:255', // Validate priority
        // ]);
    