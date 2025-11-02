// src/components/DynamicBackground.tsx
import React, { useMemo, useCallback } from 'react'
import { Particles } from '@tsparticles/react'
import { type Engine } from 'tsparticles-engine'
import { loadSlim } from '@tsparticles/slim'
import { type ISourceOptions } from 'tsparticles-engine'

export const DynamicBackground: React.FunctionComponent = () => {
  const options: ISourceOptions = useMemo(
    () => ({
      // (El posicionamiento 'style' de abajo se encarga de esto)
      background: {
        color: {
          value: 'transparent'
        }
      },
      particles: {
        // Mantenemos el cian para los puntos
        color: {
          value: '#4fbac8' // var(--color-cadetblue)
        },
        links: {
          // --- ¡AQUÍ ESTÁ EL CAMBIO! ---
          // Usamos un gris más oscuro para que se vea sobre el fondo blanco
          color: '#717680', // var(--Gray-500)
          // --- FIN DEL CAMBIO ---
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
          value: 0.5 // Hacemos los puntos un poco más opacos
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

  // El 'style' que añadimos antes es correcto y se mantiene
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
}
