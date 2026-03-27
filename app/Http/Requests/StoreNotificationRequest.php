<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNotificationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max: 255',
            'subject' => 'required|string',
            'content' => 'nullable|string',
            'priority' => 'required|string|in:normal,importante,urgente',
            'type' => 'required|string|in:adn,beneficios,colaboradores,avisos',
            'published_at' => 'required|date',
            'imagen_path' => 'nullable|image|mimes:jpg,jpeg,png,webp',
        ];
    }
}
