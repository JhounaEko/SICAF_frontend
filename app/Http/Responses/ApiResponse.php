<?php

namespace App\Http\Responses;

class ApiResponse
{
    public static function success($message = 'success', $statusCode = 200, $data = [])
    {
        return response()->json([
            'statusCode' => $statusCode,
            'message' => $message,
            'error' => false,
            'data' => $data

        ], $statusCode, ['Content-Type' => 'application/json; charset=utf-8']);
    }

    public static function error($message = 'error', $statusCode, $errorDetails = [])
    {
        return response()->json([
            'statusCode' => $statusCode,
            'message' => $message,
            'error' => true,
            'errorDetails' => $errorDetails

        ], $statusCode, ['Content-Type' => 'application/json; charset=utf-8']);
    }
}
