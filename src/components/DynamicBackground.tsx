// src/components/DynamicBackground.tsx
import React, { useMemo, useCallback } from 'react'
import { Particles } from '@tsparticles/react'
import { type Engine } from 'tsparticles-engine'
import { loadSlim } from '@tsparticles/slim'
import { type ISourceOptions } from 'tsparticles-engine'

export const DynamicBackground: React.FunctionComponent = () => {
  const options: ISourceOptions = useMemo(
    () => ({
      // --- CAMBIO ---
      // Eliminamos 'fullScreen' y 'zIndex'
      // El componente se posicionará vía 'style'
      // --- FIN CAMBIO ---

      // El fondo del canvas es transparente
      background: {
        color: {
          value: 'transparent'
        }
      },
      // Partículas (los "puntos")
      particles: {
        // ... (el resto de la configuración de particles se mantiene igual) ...
        color: {
          value: '#4fbac8'
        },
        links: {
          color: '#d5d7da',
          distance: 150,
          enable: true,
          opacity: 0.4,
          width: 1
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'out'
          },
          random: false,
          speed: 1,
          straight: false
        },
        number: {
          density: {
            enable: true
          },
          value: 80
        },
        opacity: {
          value: 0.5
        },
        shape: {
          type: 'circle'
        },
        size: {
          value: { min: 1, max: 3 }
        }
      },
      // Desactivamos la interactividad
      interactivity: {
        events: {
          onHover: {
            enable: false
          },
          onClick: {
            enable: false
          }
        }
      },
      detectRetina: true
    }),
    []
  )

  const init = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  // --- CAMBIO ---
  // Añadimos el 'style' para posicionar el canvas
  return (
    <Particles
      id='tsparticles'
      init={init}
      options={options}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0 // Lo dejamos en la base del layout
      }}
    />
  )
  // --- FIN CAMBIO ---
}
