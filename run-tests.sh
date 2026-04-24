#!/bin/bash

# Script para ejecutar tests en IntranetLOB
# Abril 2026

echo "🧪 Ejecutando tests de IntranetLOB..."

# Función para ejecutar tests
run_tests() {
    local filter="$1"
    local description="$2"

    echo ""
    echo "📋 $description"
    echo "----------------------------------------"

    if [ -n "$filter" ]; then
        php artisan test --filter="$filter"
    else
        php artisan test
    fi
}

# Tests de API
run_tests "Api" "Tests de API (Users, Stores, Notifications, Events, Departments)"

# Tests de Features existentes
run_tests "Dashboard" "Tests del Dashboard"

# Tests de Settings
run_tests "Settings" "Tests de Configuraciones"

# Tests de Auth
run_tests "Auth" "Tests de Autenticación"

# Tests de Servicios
run_tests "UserService" "Tests del UserService"

# Tests Unitarios
echo ""
echo "🔬 Tests Unitarios"
echo "----------------------------------------"
php artisan test tests/Unit/

echo ""
echo "✅ Todos los tests ejecutados"
echo "💡 Usa: ./run-tests.sh [filtro] para tests específicos"