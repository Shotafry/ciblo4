// src/components/DynamicBackground.tsx
import React, { useMemo, useCallback } from 'react'
import { Particles } from '@tsparticles/react'
import { type Engine } from 'tsparticles-engine'
import { loadSlim } from '@tsparticles/slim'
import { type ISourceOptions } from 'tsparticles-engine'

export const DynamicBackground: React.FunctionComponent = () => {
  const options: ISourceOptions = useMemo(
    () => ({
      // --- ¡AQUÍ ESTÁ EL CAMBIO! ---
      // Volvemos a usar la opción nativa de la librería
      fullScreen: {
        enable: true,
        zIndex: 0 // Lo pone en la base, pero visible
      },
      // --- FIN DEL CAMBIO ---

      // Mantenemos el fondo blanco que definimos antes
      background: {
        color: {
          value: '#ffffff' // var(--White)
        }
      },
      // Mantenemos los colores visibles
      particles: {
        color: {
          value: '#4fbac8' // var(--color-cadetblue)
        },
        links: {
          color: '#717680', // var(--Gray-500)
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

  // --- ¡AQUÍ ESTÁ EL CAMBIO! ---
  // Eliminamos todos los 'style' que pusimos manualmente
  return <Particles id='tsparticles' init={init} options={options} />
  // --- FIN DEL CAMBIO ---
}
