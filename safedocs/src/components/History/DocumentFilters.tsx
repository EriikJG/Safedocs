"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface DocumentFiltersProps {
  searchTerm: string
  filterAction: string
  filterDate: string
  onSearchChange: (value: string) => void
  onActionChange: (value: string) => void
  onDateChange: (value: string) => void
}

export function DocumentFilters({
  searchTerm,
  filterAction,
  filterDate,
  onSearchChange,
  onActionChange,
  onDateChange,
}: DocumentFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar en historial..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Acción</label>
            <Select value={filterAction} onValueChange={onActionChange}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Filtrar por acción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las acciones</SelectItem>
                <SelectItem value="upload">Subidas</SelectItem>
                <SelectItem value="download">Descargas</SelectItem>
                <SelectItem value="share">Compartidos</SelectItem>
                <SelectItem value="verify">Verificaciones</SelectItem>
                <SelectItem value="view">Visualizaciones</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Fecha</label>
            <Select value={filterDate} onValueChange={onDateChange}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Filtrar por fecha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las fechas</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
