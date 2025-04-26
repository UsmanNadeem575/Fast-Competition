<?php

namespace App\Http\Controllers;

use App\Models\Mood;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function store(Request $request)
    {
        // Validate incoming request
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'user_id' => 'required|exists:signups,id', // Ensure that the user_id exists in the signups table
        ]);
    
        // Create the task with the validated data
        $task = Task::create([
            'user_id' => $validated['user_id'],
            'title' => $validated['title'],
        ]);
    
        // Return the created task as a response
        return response()->json($task, 201);
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
        'mood' => $mood ? $mood->mood : 'neutral',  // Return mood (default to neutral if not found)
        'data' => $tasks,
    ]);
    }
}
