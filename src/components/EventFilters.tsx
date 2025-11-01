// src/components/EventFilters.tsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Collapse,
  IconButton,
  TextField,
  Autocomplete
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { EventFilterParams } from '../types'
import {
  LOCATION_DATA, // <-- Objeto con la relación Comunidad-Ciudades
  AUTONOMOUS_COMMUNITIES, // <-- Lista de Comunidades
  ALL_CITIES, // <-- Lista de TODAS las ciudades
  CYBERSECURITY_TAGS,
  EVENT_LEVELS
} from '../constants/filters'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import FilterListIcon from '@mui/icons-material/FilterList'

interface EventFiltersProps {
  onFilterChange: (filters: EventFilterParams) => void
  initialFilters: EventFilterParams
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  onFilterChange,
  initialFilters
}) => {
  const [isOpen, setIsOpen] = useState(false) // Mantenemos el colapso por defecto

  // Estado para los filtros de Nivel y Tags (sin cambios)
  const [levels, setLevels] = useState<string[]>(initialFilters.levels)
  const [tags, setTags] = useState<string[]>(initialFilters.tags)
  const [dates, setDates] = useState({
    startDate: initialFilters.startDate,
    endDate: initialFilters.endDate
  })

  // --- NUEVO ESTADO PARA LOCALIZACIONES ---
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [availableCities, setAvailableCities] = useState<string[]>(ALL_CITIES)
  // --- FIN NUEVO ESTADO ---

  const handleToggle = () => setIsOpen(!isOpen)

  const handleDateChange =
    (field: 'startDate' | 'endDate') => (date: Date | null) => {
      setDates((prev) => ({ ...prev, [field]: date }))
    }

  // --- NUEVOS HANDLERS DE LOCALIZACIÓN ---
  const handleCommunityChange = (
    event: React.SyntheticEvent,
    value: string[]
  ) => {
    setSelectedCommunities(value)

    if (value.length > 0) {
      // Si se selecciona al menos una comunidad, filtramos las ciudades
      const citiesFromSelectedCommunities = value.flatMap(
        (community) => LOCATION_DATA[community] || []
      )
      setAvailableCities([...new Set(citiesFromSelectedCommunities)].sort())

      // Limpiamos las ciudades seleccionadas que no pertenezan a la nueva lista
      setSelectedCities((prevCities) =>
        prevCities.filter((city) =>
          citiesFromSelectedCommunities.includes(city)
        )
      )
    } else {
      // Si no hay comunidades seleccionadas, mostramos todas las ciudades
      setAvailableCities(ALL_CITIES)
    }
  }

  const handleCityChange = (event: React.SyntheticEvent, value: string[]) => {
    setSelectedCities(value)
  }
  // --- FIN NUEVOS HANDLERS ---

  const handleMultiSelectChange =
    (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (event: React.SyntheticEvent, value: string[]) => {
      setter(value)
    }

  const handleApplyFilters = () => {
    // Combinamos comunidades y ciudades en el array 'locations'
    const allLocations = [
      ...new Set([...selectedCommunities, ...selectedCities])
    ]

    onFilterChange({
      startDate: dates.startDate,
      endDate: dates.endDate,
      tags: tags,
      locations: allLocations,
      levels: levels
    })
  }

  const handleClearFilters = () => {
    const clearedFilters: EventFilterParams = {
      startDate: null,
      endDate: null,
      tags: [],
      locations: [],
      levels: []
    }
    // Reseteamos todos los estados locales
    setDates({ startDate: null, endDate: null })
    setTags([])
    setLevels([])
    setSelectedCommunities([])
    setSelectedCities([])
    setAvailableCities(ALL_CITIES)

    // Enviamos los filtros limpios
    onFilterChange(clearedFilters)
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 4,
        borderRadius: '25px',
        background: 'var(--White)',
        boxShadow: 'var(--shadow-drop)'
      }}
    >
      <Box
        onClick={handleToggle}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon sx={{ color: 'var(--color-cadetblue)' }} />
          <Typography variant='h6' sx={{ color: 'var(--color-cadetblue)' }}>
            Filtros
          </Typography>
        </Box>
        <IconButton>{isOpen ? <ExpandLess /> : <ExpandMore />}</IconButton>
      </Box>

      <Collapse in={isOpen}>
        <Box sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {/* Filtro de Fechas */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <DatePicker
                label='Desde'
                value={dates.startDate}
                onChange={handleDateChange('startDate')}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <DatePicker
                label='Hasta'
                value={dates.endDate}
                onChange={handleDateChange('endDate')}
                sx={{ width: '100%' }}
              />
            </Grid>

            {/* --- FILTRO DE LOCALIZACIÓN MODIFICADO --- */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Autocomplete
                multiple
                options={AUTONOMOUS_COMMUNITIES}
                value={selectedCommunities}
                onChange={handleCommunityChange}
                renderInput={(params) => (
                  <TextField {...params} label='Comunidad Autónoma' />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Autocomplete
                multiple
                options={availableCities}
                value={selectedCities}
                onChange={handleCityChange}
                renderInput={(params) => (
                  <TextField {...params} label='Ciudad' />
                )}
              />
            </Grid>
            {/* --- FIN FILTRO LOCALIZACIÓN --- */}

            {/* Filtro de Tags */}
            <Grid item size={{ xs: 12 }}>
              <Autocomplete
                multiple
                options={CYBERSECURITY_TAGS}
                value={tags}
                onChange={handleMultiSelectChange(setTags)}
                renderInput={(params) => (
                  <TextField {...params} label='Categorías / Tags' />
                )}
              />
            </Grid>

            {/* Filtro de Nivel */}
            <Grid item size={{ xs: 12 }}>
              <Autocomplete
                multiple
                options={EVENT_LEVELS}
                value={levels}
                onChange={handleMultiSelectChange(setLevels)}
                renderInput={(params) => (
                  <TextField {...params} label='Nivel del Evento' />
                )}
              />
            </Grid>

            {/* Botones de Acción */}
            <Grid
              item
              size={{ xs: 12 }}
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                mt: 2
              }}
            >
              <Button variant='outlined' onClick={handleClearFilters}>
                Limpiar Filtros
              </Button>
              <Button
                variant='contained'
                onClick={handleApplyFilters}
                sx={{
                  // Aplicamos el estilo unificado de botón
                  background: 'var(--gradient-button-primary)',
                  '&:hover': {
                    background: 'var(--gradient-button-primary-hover)'
                  }
                }}
              >
                Aplicar Filtros
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  )
}
