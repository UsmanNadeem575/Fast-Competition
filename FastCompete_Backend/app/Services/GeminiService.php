<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GeminiService
{
    protected $apiKey;
    protected $endpoint;

    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY');
        $this->endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-v1:generateContent';
    }

    public function sendPrompt($prompt)
    {
        // Send request to Gemini API
        $response = Http::post($this->endpoint . '?key=' . $this->apiKey, [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ]
        ]);

        // Handle response
        if ($response->successful()) {
            $data = $response->json();
            return $data['candidates'][0]['content']['parts'][0]['text'] ?? 'No response';
        } else {
            return 'Error: ' . $response->body();
        }
    }
}
