<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class StorePayrollRequest extends FormRequest
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
            'zip_file' => [
                'required',
                File::types(['zip'])->max(51200), // 50 MB en KB
            ],
            'period_start'  =>  'required|date',
            'period_end'    =>  'required|date|after_or_equal:period_start',
            'period_type'   =>  'required|in:semanal,quincenal,mensual',
        ];
    }

    public function messages(): array
    {
        return [
            'zip_file.required'        => 'El archivo ZIP es requerido.',
            'zip_file.types'           => 'Solo se permiten archivos .zip.',
            'zip_file.max'             => 'El archivo no debe superar 50MB.',
            'period_start.required'    => 'La fecha de inicio es requerida.',
            'period_end.required'      => 'La fecha de fin es requerida.',
            'period_end.after_or_equal' => 'La fecha de fin debe ser posterior al inicio.',
            'period_type.required'     => 'El tipo de periodo es requerido.',
            'period_type.in'           => 'El tipo de periodo no es válido.',
        ];
    }
}
