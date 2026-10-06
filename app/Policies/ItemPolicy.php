<?php

namespace App\Policies;

use App\Models\Item;
use App\Models\User;

class ItemPolicy
{
    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Item $item): bool
    {
        return $user->id === $item->user_id || $user->hasRole('sa');
    }

    public function delete(User $user, Item $item): bool
    {
        return $this->update($user, $item);
    }
}
