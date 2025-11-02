// src/components/DynamicBackground.tsx
import React, { useMemo, useCallback } from 'react'
import { Particles } from '@tsparticles/react'
import { type Engine } from 'tsparticles-engine'
import { loadSlim } from '@tsparticles/slim'
import { type ISourceOptions } from 'tsparticles-engine'

export const DynamicBackground: React.FunctionComponent = () => {
  const options: ISourceOptions = useMemo(
    () => ({
      // --- ESTA ES LA OPCIÓN CLAVE ---
      // Le decimos a la librería que ocupe toda la pantalla
      fullScreen: {
        enable: true,
        zIndex: 0 // La pondrá en la base (z-index: 0)
      },
      // --- FIN DE LA CLAVE ---

      // Le decimos que su fondo sea blanco
      background: {
        color: {
          value: '#ffffff' // var(--White)
        }
      },
      // Le decimos que las partículas sean cian y las líneas grises
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
        // ... (resto de la configuración de movimiento, número, etc.) ...
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
  // El componente se renderiza SIN la prop 'style'
  return <Particles id='tsparticles' init={init} options={options} />
  // --- FIN DEL CAMBIO ---
}
