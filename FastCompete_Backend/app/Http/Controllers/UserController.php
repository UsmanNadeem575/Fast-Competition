<?php

namespace App\Http\Controllers;

use App\Mail\ChangePassword;
use App\Models\Otp;
use App\Models\Signup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    // check user registred or not
    function validateUser(Request $request){
        $request->validate([
            'email' => 'required|email'
        ]);

        $requesting_email = $request->input('email');

        $registered_user = Signup::where('email' , $requesting_email)->first();

        if($registered_user){
            $generating_otp = rand(10000,90000);
            $send_otp = Mail::to($requesting_email)->send(new ChangePassword($generating_otp));

            if($send_otp){
                Otp::updateOrCreate(
                    ['email' => $requesting_email], 
                    ['otp' => $generating_otp, 'created_at' => now()],
                );
                return response()->json(['success' => 'Validate User Successfully | Check Email For OTP Code'], 200);
            }else{

            }
        }else{
            return response()->json(['errors' => 'Error | This Email not registered'], 404);
        }
    }


    // check user entered otp 
    public function changePasswordOtp(Request $request)
    {
        $request->validate([
            'otp' => 'required|string',
            'email' => 'required|email'
        ]);

        $user_email = $request->email;
        $user_entered_otp = $request->otp;

        $Otp = Otp::where('email', $user_email)->first();

        if (!$Otp) {
            return response()->json([
                'success' => false,
                'status' => 404,
                'message' => 'No OTP record found for this email.'
            ], 404);
        }

        if ($Otp->otp === $user_entered_otp) {
            $otpAge = now()->diffInMinutes($Otp->created_at ?? now());
            if ($otpAge > 5) {
                return response()->json([
                    'success' => false,
                    'status' => 422,
                    'message' => 'OTP expired, please request a new one.'
                ], 422);
            }

            return response()->json([
                'success' => true,
                'status' => 200,
                'message' => 'OTP Verified'
            ]);
        }

        return response()->json([
            'success' => false,
            'status' => 400,
            'message' => 'OTP not matched. Please try again.'
        ], 400);
    }



    // update / change user password
    function changePassword(Request $request){
        $new_password = $request->input('password');
        $user_email = $request->email;

        $Signup = Signup::where('email',$user_email)->first();

        if($Signup){
            $Signup->password = Hash::make($new_password);
            if ($Signup->save()) {
                return response()->json([
                    'success' => true,
                    'status' => 200,
                    'message' => 'Password changed successfully.'
                ]);
            }else{
                return response()->json([
                    'success' => false,
                    'status' => 400,
                    'message' => 'Error Try again'
                ]);
            }
        }
        return response()->json([
            'success' => false,
            'status' => 404,
            'message' => 'User not found. Please check the email and try again.'
        ], 404);
        
    }

}
