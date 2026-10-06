<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'price' => $this->price,
            'category_id' => $this->category_id,
            'price_formatted' => $this->price !== null ? '$'.number_format($this->price, 2) : 'Intercambio',
            'type' => $this->listing_type,
            'status' => $this->status,
            'user_id' => $this->user_id,
            'seller' => $this->whenLoaded('user', fn () => $this->user?->name),
            'category' => $this->whenLoaded('category', fn () => $this->category?->name),
            'cover_url' => $this->whenLoaded('coverImage', fn () => $this->coverImage?->url),
        ];
    }
}
