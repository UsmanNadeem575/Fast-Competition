<?php

namespace App\Http\Controllers;

use App\Models\Mood;
use Illuminate\Http\Request;

class MoodController extends Controller
{
    // Controller method for updating mood
    public function updateMood(Request $request)
    {
        // Validate incoming request
        $validated = $request->validate([
            'user_id' => 'required|exists:signups,id', // Ensure user exists in 'signups' table
            'mood' => 'required|string', // Ensure mood is a string
        ]);

        // Create a new mood record in the 'moods' table
        $mood = new Mood();
        $mood->user_id = $validated['user_id'];
        $mood->mood = $validated['mood'];
        $mood->save();

        return response()->json(['message' => 'Mood updated successfully'], 200);
    }

}
