<?php

namespace App\Policies;

use App\Models\PayRollFiles;
use App\Models\User;

class PayRollFilesPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['sa', 'rh']);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function view(User $user, PayRollFiles $file): bool
    {
        return $this->viewAny($user) || $user->id === $file->user_id;
    }

    public function delete(User $user, PayRollFiles $file): bool
    {
        return $this->viewAny($user);
    }
}
