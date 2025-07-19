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
        <h2>¿Qué es Cifras Del Mundo?</h2>
        <p style={{ margin: '20px 0', lineHeight: '1.6' }}>
          Cifras Del Mundo es un juego de preguntas con respuesta numérica. El juego fue creado en 3 días durante un viaje de colegas a Santander con el objetivo de beber.
        </p>
        
        <h3>¿Cómo jugar?</h3>
        <ul style={{ 
          textAlign: 'center' as const, 
          maxWidth: '500px', 
          margin: '20px auto', 
          lineHeight: '1.6' 
        }}>
          <p>El jugador que más se acerque a la cifra correcta gana 1 punto. </p>
          <p>El jugador que acierte la cifra exacta gana 2 puntos.</p>
          <p>Un punto equivale a repartir 3 tragos.</p>
        </ul>
        
        
        <h3>Créditos</h3>
        <p style={{ margin: '20px 0', lineHeight: '1.6' }}>
          Javi, Cholo, Agra, Solla, Ingelmo, Domingo, Rómulo.
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