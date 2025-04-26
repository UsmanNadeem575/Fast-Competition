<?php

use App\Http\Controllers\AIController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\MoodController;
use App\Http\Controllers\SignupController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// user signup + create OTP + send OTP on email + update OTP + check already registered user
Route::post('signup',[SignupController::class, 'sendOtp']);

// verify OTP + store verified user in database
Route::post('verifyOtp',[SignupController::class, 'verifyOtp']);

// resend OTP
Route::post('resendOtp',[SignupController::class,'resendOtp']);


/////////////////////////////////////////////////////////////////////


// user login 
Route::post('login',[LoginController::class, 'userLogin']);

// is user registered ?
Route::post('validateUser',[UserController::class, 'validateUser']);

// check otp match or not
Route::post('changePasswordOtp',[UserController::class, 'changePasswordOtp']);
 
// update password
Route::post('changePassword',[UserController::class, 'changePassword']); 


/////////////////////////////////////////////////////////////////////

Route::post('/tasks', [TaskController::class, 'store']);

Route::get('/fetchTasks', [TaskController::class, 'index']);

////////////////////////////////////////////////////////////////////

Route::post('/updateMood', [MoodController::class, 'updateMood']);

