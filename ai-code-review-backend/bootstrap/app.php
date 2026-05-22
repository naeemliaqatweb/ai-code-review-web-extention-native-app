<?php

use App\Http\Middleware\ForceJsonResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->append(ForceJsonResponse::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                $statusCode = 500;

                if (method_exists($e, 'getStatusCode')) {
                    $statusCode = $e->getStatusCode();
                } elseif ($e instanceof AuthenticationException) {
                    $statusCode = 401;
                } elseif ($e instanceof ModelNotFoundException) {
                    $statusCode = 404;
                } elseif (method_exists($e, 'status')) {
                    // some exceptions have a status property instead of getStatusCode
                    $statusCode = $e->status;
                }

                if ($e instanceof ValidationException) {
                    return response()->json([
                        'message' => $e->getMessage(),
                        'errors' => $e->errors(),
                    ], $e->status);
                }

                return response()->json([
                    'message' => $e->getMessage() ?: 'Server Error',
                    'error' => class_basename($e),
                ], $statusCode);
            }
        });
    })->create();
