<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Get the authenticated user with counts.
     */
    public function me(Request $request)
    {
        $user = $request->user();
        $user->counts = [
            'text' => $user->textSubmissions()->count(),
            'code' => $user->codeSubmissions()->count(),
            'resume' => $user->resumes()->count(),
        ];

        return response()->json($user);
    }

    /**
     * Handle user registration.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('AuthToken')->accessToken;

        $user->counts = ['text' => 0, 'code' => 0, 'resume' => 0];

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Handle user login.
     */
    public function login(Request $request)
    {
        Log::info('Login Request Data:', $request->all());

        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('AuthToken')->accessToken;

        $user->counts = [
            'text' => $user->textSubmissions()->count(),
            'code' => $user->codeSubmissions()->count(),
            'resume' => $user->resumes()->count(),
        ];

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }
}
