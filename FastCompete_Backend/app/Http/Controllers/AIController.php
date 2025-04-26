<?php

namespace App\Http\Controllers;

use App\Services\AIService;
use Illuminate\Http\Request;

class AIController extends Controller
{
    protected $aiService;

    // Inject the AIService into the controller
    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    // Function to handle requests and call OpenAI API
    public function generateText(Request $request)
    {
        $prompt = $request->input('prompt');  // Get the prompt from the request
        $result = $this->aiService->generateText($prompt);  // Call AIService

        return response()->json($result);  // Return the result as JSON
    }
}
