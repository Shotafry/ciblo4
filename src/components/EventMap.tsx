// src/components/EventMap.tsx
import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Box, Typography, Button, Chip, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Event } from '../types'
import L from 'leaflet' // Importamos Leaflet para el icono
// import markerIconPng from '/cyberLogo-gigapixel-art-scale-2-00x-godpix-12@2x.png' // <-- ELIMINADO

// Iconos para el popup
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import GroupIcon from '@mui/icons-material/Group'

// --- MODIFICADO: Icono de chincheta personalizado ---
// Usamos un L.divIcon para crear un marcador con CSS (el que definimos en global.css)
const customMarkerIcon = L.divIcon({
  className: 'leaflet-pulsing-icon', // <-- Esta es la clase que crea la onda
  iconSize: [16, 16], // Tamaño del icono
  iconAnchor: [8, 8], // Centro del icono
  popupAnchor: [0, -10] // Dónde se abre el popup
})

// --- SIN CAMBIOS: Componente interno para el contenido del Popup ---
// Este es tu diseño "guapo" y se mantiene 100% igual
const EventPopupContent: React.FC<{ event: Event }> = ({ event }) => {
  const navigate = useNavigate()
  const handleNavigate = () => {
    navigate(`/eventos/${event.slug}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <Box sx={{ width: 300, p: 1, fontFamily: 'Inter, sans-serif' }}>
      {/* 1. Título */}
      <Typography
        variant='h6'
        component='h3'
        sx={{ fontWeight: 700, color: 'var(--color-cadetblue)', mb: 1.5 }}
      >
        {event.title}
      </Typography>

      {/* 2. Info Rápida */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <CalendarTodayIcon sx={{ fontSize: 18, color: 'var(--Gray-700)' }} />
        <Typography variant='body2'>{formatDate(event.start_date)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <LocationOnIcon sx={{ fontSize: 18, color: 'var(--Gray-700)' }} />
        <Typography variant='body2' sx={{ flex: 1 }}>
          {event.is_online
            ? 'Online'
            : `${event.venue_city}, ${event.venue_community}`}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <GroupIcon sx={{ fontSize: 18, color: 'var(--Gray-700)' }} />
        <Typography variant='body2'>
          {event.current_attendees} asistentes
        </Typography>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* 3. Breve Descripción */}
      <Typography
        variant='body2'
        sx={{ mb: 2, color: 'var(--Gray-700)', fontStyle: 'italic' }}
      >
        {event.short_desc}
      </Typography>

      {/* 4. Tags */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
        {event.tags.slice(0, 3).map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size='small'
            sx={{
              backgroundColor: 'var(--Gray-100)',
              color: 'var(--Gray-700)',
              fontSize: '0.75rem'
            }}
          />
        ))}
      </Box>

      {/* 5. Botón de Acción */}
      <Button
        variant='contained'
        fullWidth
        onClick={handleNavigate}
        sx={{
          borderRadius: '25px',
          background: 'var(--gradient-button-primary)',
          '&:hover': {
            background: 'var(--gradient-button-primary-hover)'
          }
        }}
      >
        Ver Evento
      </Button>
    </Box>
  )
}

// --- COMPONENTE PRINCIPAL DEL MAPA (Modificado) ---
export const EventMap: React.FC<EventMapProps> = ({ events }) => {
  const mapCenter: [number, number] = [40.416775, -3.70379]

  return (
    <Box
      sx={{
        height: '836px',
        width: '100%',
        maxWidth: '1340px',
        borderRadius: '25px',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'var(--shadow-drop)'
      }}
    >
      <MapContainer
        center={mapCenter}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        {events.map((event) => {
          if (event.latitude && event.longitude) {
            return (
              <Marker
                key={event.id}
                position={[event.latitude, event.longitude]}
                icon={customMarkerIcon} // <-- USAMOS EL NUEVO ICONO PULSANTE
              >
                <Popup>
                  <EventPopupContent event={event} />
                </Popup>
              </Marker>
            )
          }
          return null
        })}
      </MapContainer>
    </Box>
  )
}
