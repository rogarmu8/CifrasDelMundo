import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="container">
      <header>
        <h1>Sobre CifrasDelMundo</h1>
      </header>
      
      <main style={{ 
        background: 'rgba(245, 245, 245, 0.75)', 
        borderRadius: '16px', 
        padding: '30px', 
        margin: '20px 0',
        textAlign: 'center' as const
      }}>
        <h2>¿Qué es CifrasDelMundo?</h2>
        <p style={{ margin: '20px 0', lineHeight: '1.6' }}>
          CifrasDelMundo es un juego de trivia único donde todas las preguntas se responden con números. 
          Descubre datos fascinantes sobre el mundo a través de cifras y estadísticas.
        </p>
        
        <h3>¿Cómo jugar?</h3>
        <ul style={{ 
          textAlign: 'left' as const, 
          maxWidth: '500px', 
          margin: '20px auto', 
          lineHeight: '1.6' 
        }}>
          <li>Mantén presionado el botón para revelar la respuesta</li>
          <li>Mantén presionado nuevamente para pasar a la siguiente pregunta</li>
          <li>El contador muestra cuántas preguntas has visto</li>
          <li>Las preguntas están organizadas por categorías</li>
        </ul>
        
        <h3>Categorías</h3>
        <p style={{ margin: '20px 0', lineHeight: '1.6' }}>
          Naturaleza, Geografía, Historia, Matemáticas, Deportes y Demografía
        </p>
        
        <Link href="/" style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          marginTop: '20px'
        }}>
          Volver al juego
        </Link>
      </main>
      
      <footer>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          ¿Cuánto sabes sobre el mundo en números?
        </p>
      </footer>
    </div>
  )
} 