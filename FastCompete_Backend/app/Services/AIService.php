<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class AIService
{
    protected $apiKey;

    public function __construct()
    {
        // Get the API key from the environment
        $this->apiKey = env('OPENAI_API_KEY');
    }

    // Function to generate text using OpenAI's GPT-3 API
    public function generateText($prompt)
    {
        // Send a POST request to the OpenAI API
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
        ])->post('https://api.openai.com/v1/completions', [
            'model' => 'text-davinci-003',  // You can choose different models like 'gpt-3.5-turbo'
            'prompt' => $prompt,
            'max_tokens' => 100,            // You can change this value based on your requirements
            'temperature' => 0.7,           // Adjust creativity (0.0 = deterministic, 1.0 = creative)
        ]);

        // Return the AI response
        return $response->json();
    }
}
