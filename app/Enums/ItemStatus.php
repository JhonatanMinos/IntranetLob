<?php

namespace App\Enums;

enum ItemStatus: string
{
    case Draft     = 'draft';
    case Available = 'available';
    case Reserved  = 'reserved';
    case Sold      = 'sold';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Draft     => 'Borrador',
            self::Available => 'Disponible',
            self::Reserved  => 'Reservado',
            self::Sold      => 'Vendido',
            self::Cancelled => 'Cancelado',
        };
    }

    /** Solo estos estados son visibles en el marketplace público */
    public function isPublic(): bool
    {
        return match ($this) {
            self::Available, self::Reserved => true,
            default                         => false,
        };
    }
}
