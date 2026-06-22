<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->index(['account_id', 'transaction_date'], 'idx_transactions_account_date');
            $table->index(['user_id', 'transaction_date'], 'idx_transactions_user_date');
        });

        Schema::table('account_balances', function (Blueprint $table) {
            $table->index(['account_id', 'balance_date'], 'idx_balances_account_date');
        });

        Schema::table('budget_periods', function (Blueprint $table) {
            $table->index(['budget_id', 'start_date', 'end_date'], 'idx_budget_periods_dates');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex('idx_transactions_account_date');
            $table->dropIndex('idx_transactions_user_date');
        });

        Schema::table('account_balances', function (Blueprint $table) {
            $table->dropIndex('idx_balances_account_date');
        });

        Schema::table('budget_periods', function (Blueprint $table) {
            $table->dropIndex('idx_budget_periods_dates');
        });
    }
};
