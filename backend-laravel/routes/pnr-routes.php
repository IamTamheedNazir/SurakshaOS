<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PNRInventoryController;
use App\Http\Controllers\PNRSaleController;

/*
|--------------------------------------------------------------------------
| PNR Inventory Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')->group(function () {
    
    // PNR Inventory Management
    Route::prefix('pnr-inventory')->group(function () {
        Route::get('/dashboard', [PNRInventoryController::class, 'dashboard']);
        Route::get('/', [PNRInventoryController::class, 'index']);
        Route::post('/', [PNRInventoryController::class, 'store']);
        Route::get('/{id}', [PNRInventoryController::class, 'show']);
        Route::put('/{id}', [PNRInventoryController::class, 'update']);
        Route::delete('/{id}', [PNRInventoryController::class, 'destroy']);
        Route::get('/warnings/expiry', [PNRInventoryController::class, 'expiryWarnings']);
    });
    
    // PNR Sales Management
    Route::prefix('pnr-sales')->group(function () {
        Route::get('/', [PNRSaleController::class, 'index']);
        Route::post('/', [PNRSaleController::class, 'store']);
        Route::get('/{id}', [PNRSaleController::class, 'show']);
        Route::post('/{id}/payment', [PNRSaleController::class, 'updatePayment']);
        Route::get('/{id}/download-voucher', [PNRSaleController::class, 'downloadVoucher'])->name('pnr-sales.download-voucher');
        Route::post('/{id}/resend-email', [PNRSaleController::class, 'resendEmail']);
        Route::post('/{id}/resend-whatsapp', [PNRSaleController::class, 'resendWhatsApp']);
    });
    
    // Cron job route (should be protected with middleware)
    Route::post('/pnr-inventory/check-expired', [PNRInventoryController::class, 'checkExpired']);
});
