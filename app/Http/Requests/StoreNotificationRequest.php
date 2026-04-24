<?php

namespace App\Http\Requests;

use App\Models\Notification;
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
            'content' => 'nullable|string|max:4294967295',
            'type'     => 'required|in:' . implode(',', [
                Notification::TYPE_ADN,
                Notification::TYPE_BENEFICIOS,
                Notification::TYPE_COLABORADORES,
                Notification::TYPE_AVISO
            ]),
            'priority' => 'required|in:' . implode(',', [
                Notification::PRIORITY_NORMAL,
                Notification::PRIORITY_IMPORTANT,
                Notification::PRIORITY_URGENT
            ]),
            'published_at' => 'required|date',
            'imagen_path' => 'nullable|image|mimes:jpg,jpeg,png,webp',
        ];
    }
}
