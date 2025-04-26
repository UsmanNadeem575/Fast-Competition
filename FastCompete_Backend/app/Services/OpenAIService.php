<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class OpenAIService
{
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = env('OPENAI_API_KEY');
    }

    public function extractDetailsFromText($text)
    {
        $prompt = "Extract the following details from the given text: 
- Title
- Due Date
- Category
- Priority

Respond ONLY in JSON format like:
{
    \"title\": \"\",
    \"due_date\": \"\",
    \"category\": \"\",
    \"priority\": \"\"
}

Text: \"$text\"";

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'user', 'content' => $prompt],
            ],
            'temperature' => 0.2,
        ]);

        $result = $response->json();

        return $result['choices'][0]['message']['content'] ?? null;
    }
}
