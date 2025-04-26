<?php

namespace App\Http\Controllers;

use App\Mail\OtpEmail;
use App\Models\Otp;
use App\Models\Signup;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class SignupController extends Controller
{

    function sendOtp(Request $request){

        $already_user = Signup::where('email',$request->email)->first();

        if ($already_user) {
            return response()->json([
                'success' => false,
                'message' => 'This email is already registered',
            ],403);
        }

        $request->validate([
            'username' => 'required',
            'email' => 'required',
            'password' => 'required'
        ]);

        $username = $request->input('username');
        $email = $request->input('email');
        $password = $request->input('password');

        $otp = mt_rand(100000,900000);

        // store username,email,password and OTP temporarily (in cache)
        Cache::put('signup_' . $email, [
            'username' => $username,
            'email' => $email,
            'password' => Hash::make($password), 
            'otp' => $otp
        ], 60); 

        Otp::updateOrCreate(
            ['email' => $email], 
            ['otp' => $otp, 'created_at' => now()],
        );
        
        Mail::to($email)->send(new OtpEmail($otp));

        return response()->json([
            'success' => true,
            'message' => $otp
        ]);
    }


     // verify OTP
     function verifyOtp(Request $request){
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|numeric',
        ]);

        $user_email = $request->input('email');
        $user_otp = $request->input('otp');

        $otpRecord = Otp::where('email', $user_email)->first();

        if($otpRecord){
            if($otpRecord->otp == $user_otp){
                $otpAge = now()->diffInMinutes($otpRecord->created_at);
                if($otpAge > 1){
                    return response()->json([
                        'status' => 400,
                        'message' => 'OTP expired, please request a new one.'
                    ]);
                }

                $cacheData = Cache::get('signup_' . $user_email);

                 if ($cacheData) {
                    // Store user data in the database (permanent storage)
                    Signup::create([
                        'username' => $cacheData['username'],
                        'email' => $cacheData['email'],
                        'password' => $cacheData['password'], 
                        'status' => 'verified',
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now()
                    ]);
 
                    // Delete the cache after successful registration
                    Cache::forget('signup_' . $user_email);
 
                    return response()->json([
                        'status' => 200,
                        'message' => 'User registered successfully and OTP verified.',
                    ]);
                 } else {
                     return response()->json([
                        'status' => 400,
                        'message' => 'OTP is expired. Please try again'
                     ]);
                 }
             } else {
                 return response()->json([
                     'status' => 400,
                     'message' => 'Invalid OTP'
                 ]);
             }
         } else {
             return response()->json([
                 'status' => 400,
                 'message' => 'No OTP record found. Please request a new OTP.'
             ]);
         }
     }

     
    // resend OTP
    function resendOtp(Request $request){
        $username = $request->input('username');
        $email = $request->input('email');
        $password = $request->input('password');

        $new_otp = mt_rand(100000,900000);

        // store username,email,password and OTP temporarily (in cache)
        Cache::put('signup_' . $email, [
            'username' => $username,
            'email' => $email,
            'password' => Hash::make($password), 
            'otp' => $new_otp
        ], 60); 

        Otp::updateOrCreate(
            ['email' => $email], 
            ['otp' => $new_otp, 'created_at' => now()],
        );
        
        $send_again = Mail::to($email)->send(new OtpEmail($new_otp));

        if($send_again){
            return response()->json([
                'success' => true,
                'message' => 'New OTP sent successfully.'
            ]);
        }else{
            return response()->json([
                'success' => false,
                'message' => 'Error | Try again'
            ]);
        }
     }


    
    


}
         