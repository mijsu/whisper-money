<?php

namespace App\Models;

use Database\Factories\BankFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Bank extends Model
{
    /** @use HasFactory<BankFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'name',
        'logo',
        'user_id',
    ];

    /** @var list<string> */
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * Scope to banks visible to the given user: public banks plus their own.
     *
     * @param  Builder<Bank>  $query
     * @return Builder<Bank>
     */
    public function scopeAvailableForUser(Builder $query, User $user): Builder
    {
        return $query->where(function (Builder $q) use ($user) {
            $q->whereNull('user_id')
                ->orWhere('user_id', $user->id);
        });
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<Account, $this> */
    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }

    public function getLogoAttribute(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            $appUrl = config('app.url');
            $parsed = parse_url($value);
            $storedBase = $parsed['scheme'].'://'.$parsed['host'];
            if (isset($parsed['port'])) {
                $storedBase .= ':'.$parsed['port'];
            }

            return str_replace($storedBase, $appUrl, $value);
        }

        return Storage::disk('public')->url($value);
    }
}
