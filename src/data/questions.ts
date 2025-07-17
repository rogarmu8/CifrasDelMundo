export interface Question {
  question: string;
  answer: number;
  explanation: string;
  category: string;
}

export const questions: Question[] = [
  {
    question: "¿Cuántos países hay en el mundo reconocidos por la ONU?",
    answer: 193,
    explanation: "La ONU reconoce oficialmente 193 países miembros.",
    category: "Geografía"
  },
  {
    question: "¿Cuántos minutos tiene una hora?",
    answer: 60,
    explanation: "Una hora se compone de 60 minutos.",
    category: "Matemáticas"
  },
  {
    question: "¿Cuántos huesos tiene el cuerpo humano adulto?",
    answer: 206,
    explanation: "El cuerpo humano adulto tiene 206 huesos en total.",
    category: "Naturaleza"
  },
  {
    question: "¿En qué año llegó el hombre a la Luna?",
    answer: 1969,
    explanation: "La misión Apolo 11 llegó a la Luna en 1969.",
    category: "Historia"
  },
  {
    question: "¿Cuántos continentes hay en la Tierra?",
    answer: 7,
    explanation: "Los continentes son: África, América, Asia, Europa, Oceanía, Antártida y la Antártida.",
    category: "Geografía"
  },
  {
    question: "¿Cuántos planetas hay en el sistema solar?",
    answer: 8,
    explanation: "Actualmente se reconocen 8 planetas en el sistema solar.",
    category: "Naturaleza"
  },
  {
    question: "¿Cuántos colores tiene el arcoíris?",
    answer: 7,
    explanation: "El arcoíris tiene 7 colores: rojo, naranja, amarillo, verde, azul, añil y violeta.",
    category: "Naturaleza"
  },
  {
    question: "¿Cuántos días tiene un año bisiesto?",
    answer: 366,
    explanation: "Un año bisiesto tiene 366 días, uno más que un año normal.",
    category: "Matemáticas"
  },
  {
    question: "¿Cuántos jugadores hay en un equipo de fútbol en el campo?",
    answer: 11,
    explanation: "Cada equipo de fútbol tiene 11 jugadores en el campo.",
    category: "Deportes"
  },
  {
    question: "¿Cuántos segundos tiene un minuto?",
    answer: 60,
    explanation: "Un minuto se compone de 60 segundos.",
    category: "Matemáticas"
  },
  // NUEVAS PREGUNTAS - NATURALEZA
  {
    question: "¿Cuántas avispas asiáticas hay en un nido que tiene un año de longevidad?",
    answer: 15000,
    explanation: "Un nido maduro de avispa asiática puede contener hasta 15,000 individuos en su punto máximo.",
    category: "Naturaleza"
  },
  {
    question: "¿Cuántos pasos da un humano a lo largo de su vida?",
    answer: 216000000,
    explanation: "Un humano promedio da aproximadamente 216 millones de pasos en su vida, considerando 7,500 pasos diarios durante 80 años.",
    category: "Naturaleza"
  },
  {
    question: "¿Cuántos latidos por minuto tiene el corazón de una ballena azul adulta?",
    answer: 4,
    explanation: "El corazón de una ballena azul late solo 4 veces por minuto en reposo, siendo el latido más lento entre todos los mamíferos.",
    category: "Naturaleza"
  },
  {
    question: "¿Cuántos años puede vivir una tortuga gigante de las Galápagos?",
    answer: 177,
    explanation: "La tortuga gigante de las Galápagos puede vivir hasta 177 años, siendo uno de los animales más longevos del planeta.",
    category: "Naturaleza"
  },
  {
    question: "¿Cuántos kilómetros puede volar sin parar un albatros errante?",
    answer: 16000,
    explanation: "El albatros errante puede volar hasta 16,000 kilómetros sin parar, aprovechando las corrientes de aire oceánicas.",
    category: "Naturaleza"
  },
  {
    question: "¿Cuántos dientes tiene un tiburón blanco adulto?",
    answer: 300,
    explanation: "Un tiburón blanco adulto tiene aproximadamente 300 dientes en múltiples filas, que se reemplazan constantemente.",
    category: "Naturaleza"
  },
  {
    question: "¿Cuántos metros de altura puede alcanzar un árbol secuoya gigante?",
    answer: 115,
    explanation: "Los árboles secuoya gigante pueden alcanzar hasta 115 metros de altura, siendo los árboles más altos del mundo.",
    category: "Naturaleza"
  },
  {
    question: "¿Cuántos huevos puede poner una tortuga marina en una sola puesta?",
    answer: 200,
    explanation: "Una tortuga marina puede poner hasta 200 huevos en una sola puesta, aunque no todos sobreviven hasta la edad adulta.",
    category: "Naturaleza"
  },
  {
    question: "¿Cuántos años tarda en formarse una perla natural?",
    answer: 6,
    explanation: "Una perla natural tarda aproximadamente 6 años en formarse completamente dentro de una ostra.",
    category: "Naturaleza"
  },
  {
    question: "¿Cuántos kilómetros por hora puede correr un guepardo?",
    answer: 110,
    explanation: "El guepardo puede alcanzar velocidades de hasta 110 kilómetros por hora, siendo el animal terrestre más rápido.",
    category: "Naturaleza"
  },
  // NUEVAS PREGUNTAS - GEOGRAFÍA
  {
    question: "¿Cuántos metros de profundidad tiene el punto más profundo del océano, la Fosa de las Marianas?",
    answer: 11034,
    explanation: "La Fosa de las Marianas tiene una profundidad de 11,034 metros en su punto más profundo, conocido como el Abismo de Challenger.",
    category: "Geografía"
  },
  {
    question: "¿Cuántos kilómetros de costa tiene Noruega?",
    answer: 25148,
    explanation: "Noruega tiene 25,148 kilómetros de costa, incluyendo todos sus fiordos e islas, siendo uno de los países con más costa del mundo.",
    category: "Geografía"
  },
  {
    question: "¿Cuántos metros de altura tiene el Monte Everest?",
    answer: 8849,
    explanation: "El Monte Everest tiene una altura oficial de 8,849 metros sobre el nivel del mar, siendo la montaña más alta del mundo.",
    category: "Geografía"
  },
  {
    question: "¿Cuántos kilómetros cuadrados tiene el desierto del Sahara?",
    answer: 9200000,
    explanation: "El desierto del Sahara cubre aproximadamente 9.2 millones de kilómetros cuadrados, siendo el desierto cálido más grande del mundo.",
    category: "Geografía"
  },
  {
    question: "¿Cuántos metros de profundidad tiene el lago Baikal?",
    answer: 1642,
    explanation: "El lago Baikal tiene una profundidad máxima de 1,642 metros, siendo el lago más profundo del mundo.",
    category: "Geografía"
  },
  {
    question: "¿Cuántos kilómetros de longitud tiene el río Amazonas?",
    answer: 6992,
    explanation: "El río Amazonas tiene una longitud de 6,992 kilómetros, siendo el río más largo del mundo.",
    category: "Geografía"
  },
  {
    question: "¿Cuántos metros de altura tiene la cascada más alta del mundo, el Salto del Ángel?",
    answer: 979,
    explanation: "El Salto del Ángel en Venezuela tiene una altura de 979 metros, siendo la cascada más alta del mundo.",
    category: "Geografía"
  },
  {
    question: "¿Cuántos kilómetros cuadrados tiene la isla más grande del mundo, Groenlandia?",
    answer: 2166086,
    explanation: "Groenlandia tiene una superficie de 2,166,086 kilómetros cuadrados, siendo la isla más grande del mundo.",
    category: "Geografía"
  },
  {
    question: "¿Cuántos metros de altura tiene el volcán más alto del mundo, el Nevado Ojos del Salado?",
    answer: 6893,
    explanation: "El Nevado Ojos del Salado tiene una altura de 6,893 metros, siendo el volcán más alto del mundo.",
    category: "Geografía"
  },
  {
    question: "¿Cuántos kilómetros de longitud tiene la Gran Barrera de Coral?",
    answer: 2300,
    explanation: "La Gran Barrera de Coral tiene una longitud de 2,300 kilómetros, siendo el sistema de arrecifes más grande del mundo.",
    category: "Geografía"
  },
  // NUEVAS PREGUNTAS - HISTORIA
  {
    question: "¿En qué año se fundó la ciudad de Roma?",
    answer: 753,
    explanation: "Según la tradición romana, la ciudad de Roma fue fundada en el año 753 a.C. por Rómulo y Remo.",
    category: "Historia"
  },
  {
    question: "¿En qué año se descubrió América por Cristóbal Colón?",
    answer: 1492,
    explanation: "Cristóbal Colón llegó a América el 12 de octubre de 1492, desembarcando en la isla de Guanahaní.",
    category: "Historia"
  },
  {
    question: "¿En qué año comenzó la Primera Guerra Mundial?",
    answer: 1914,
    explanation: "La Primera Guerra Mundial comenzó en 1914 con el asesinato del Archiduque Francisco Fernando de Austria.",
    category: "Historia"
  },
  {
    question: "¿En qué año terminó la Segunda Guerra Mundial?",
    answer: 1945,
    explanation: "La Segunda Guerra Mundial terminó en 1945 con la rendición de Alemania en mayo y Japón en septiembre.",
    category: "Historia"
  },
  {
    question: "¿En qué año se construyó la Gran Muralla China?",
    answer: 214,
    explanation: "La construcción de la Gran Muralla China comenzó en el año 214 a.C. durante la dinastía Qin.",
    category: "Historia"
  },
  {
    question: "¿En qué año se fundó la ciudad de Tenochtitlán?",
    answer: 1325,
    explanation: "La ciudad de Tenochtitlán, capital del Imperio Azteca, fue fundada en el año 1325 d.C.",
    category: "Historia"
  },
  {
    question: "¿En qué año se inventó la imprenta por Gutenberg?",
    answer: 1440,
    explanation: "Johannes Gutenberg inventó la imprenta de tipos móviles alrededor del año 1440 en Alemania.",
    category: "Historia"
  },
  {
    question: "¿En qué año se firmó la Declaración de Independencia de Estados Unidos?",
    answer: 1776,
    explanation: "La Declaración de Independencia de Estados Unidos fue firmada el 4 de julio de 1776.",
    category: "Historia"
  },
  {
    question: "¿En qué año se construyó la Torre Eiffel?",
    answer: 1889,
    explanation: "La Torre Eiffel fue construida en 1889 para la Exposición Universal de París.",
    category: "Historia"
  },
  {
    question: "¿En qué año cayó el Imperio Romano de Occidente?",
    answer: 476,
    explanation: "El Imperio Romano de Occidente cayó en el año 476 d.C. con la deposición del último emperador, Rómulo Augústulo.",
    category: "Historia"
  },
  // NUEVAS PREGUNTAS - MATEMÁTICAS
  {
    question: "¿Cuántos decimales tiene el número pi (π) conocidos hasta 2024?",
    answer: 1000000000000,
    explanation: "Hasta 2024, se han calculado más de 1 billón de decimales del número pi (π).",
    category: "Matemáticas"
  },
  {
    question: "¿Cuántos segundos hay en un año no bisiesto?",
    answer: 31536000,
    explanation: "Un año no bisiesto tiene 31,536,000 segundos (365 días × 24 horas × 60 minutos × 60 segundos).",
    category: "Matemáticas"
  },
  {
    question: "¿Cuántos números primos hay entre 1 y 100?",
    answer: 25,
    explanation: "Entre 1 y 100 hay 25 números primos: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97.",
    category: "Matemáticas"
  },
  {
    question: "¿Cuántos grados suman los ángulos internos de un hexágono?",
    answer: 720,
    explanation: "Los ángulos internos de un hexágono suman 720 grados (6 lados × 120 grados cada uno).",
    category: "Matemáticas"
  },
  {
    question: "¿Cuántos metros cuadrados tiene un campo de fútbol reglamentario?",
    answer: 7140,
    explanation: "Un campo de fútbol reglamentario tiene 7,140 metros cuadrados (105 metros × 68 metros).",
    category: "Matemáticas"
  },
  {
    question: "¿Cuántos mililitros hay en un litro?",
    answer: 1000,
    explanation: "Un litro equivale a 1,000 mililitros.",
    category: "Matemáticas"
  },
  {
    question: "¿Cuántos centímetros hay en un metro?",
    answer: 100,
    explanation: "Un metro equivale a 100 centímetros.",
    category: "Matemáticas"
  },
  {
    question: "¿Cuántos gramos hay en un kilogramo?",
    answer: 1000,
    explanation: "Un kilogramo equivale a 1,000 gramos.",
    category: "Matemáticas"
  },
  {
    question: "¿Cuántos minutos hay en un día?",
    answer: 1440,
    explanation: "Un día tiene 1,440 minutos (24 horas × 60 minutos).",
    category: "Matemáticas"
  },
  {
    question: "¿Cuántos segundos hay en una hora?",
    answer: 3600,
    explanation: "Una hora tiene 3,600 segundos (60 minutos × 60 segundos).",
    category: "Matemáticas"
  },
  // NUEVAS PREGUNTAS - DEPORTES
  {
    question: "¿Cuántas ligas tiene el equipo que ganó la Liga 1 tailandesa en 2024?",
    answer: 18,
    explanation: "El equipo que ganó la Liga 1 tailandesa en 2024 tiene 18 ligas en su palmarés total.",
    category: "Deportes"
  },
  {
    question: "¿Cuántos jugadores hay en un equipo de baloncesto en la cancha?",
    answer: 5,
    explanation: "En baloncesto, cada equipo tiene 5 jugadores en la cancha durante el juego.",
    category: "Deportes"
  },
  {
    question: "¿Cuántos minutos dura un partido de fútbol reglamentario?",
    answer: 90,
    explanation: "Un partido de fútbol reglamentario dura 90 minutos, divididos en dos tiempos de 45 minutos.",
    category: "Deportes"
  },
  {
    question: "¿Cuántos sets se necesitan para ganar un partido de tenis en Grand Slam?",
    answer: 3,
    explanation: "En los torneos de Grand Slam, se necesitan 3 sets para ganar un partido (excepto en el Abierto de Australia que puede requerir 2).",
    category: "Deportes"
  },
  {
    question: "¿Cuántos jugadores hay en un equipo de voleibol en la cancha?",
    answer: 6,
    explanation: "En voleibol, cada equipo tiene 6 jugadores en la cancha durante el juego.",
    category: "Deportes"
  },
  {
    question: "¿Cuántos puntos vale un touchdown en fútbol americano?",
    answer: 6,
    explanation: "Un touchdown en fútbol americano vale 6 puntos.",
    category: "Deportes"
  },
  {
    question: "¿Cuántos jugadores hay en un equipo de béisbol en el campo?",
    answer: 9,
    explanation: "En béisbol, cada equipo tiene 9 jugadores en el campo durante el juego.",
    category: "Deportes"
  },
  {
    question: "¿Cuántos minutos dura un cuarto en baloncesto NBA?",
    answer: 12,
    explanation: "En la NBA, cada cuarto dura 12 minutos, con 4 cuartos por partido.",
    category: "Deportes"
  },
  {
    question: "¿Cuántos jugadores hay en un equipo de hockey sobre hielo en la pista?",
    answer: 6,
    explanation: "En hockey sobre hielo, cada equipo tiene 6 jugadores en la pista durante el juego.",
    category: "Deportes"
  },
  {
    question: "¿Cuántos puntos vale un gol en fútbol?",
    answer: 1,
    explanation: "Un gol en fútbol vale 1 punto, siendo la forma de anotación principal del deporte.",
    category: "Deportes"
  },
  // NUEVAS PREGUNTAS - DEMOGRAFÍA
  {
    question: "¿Cuántos litros de Coca-Cola bebe un peruano en promedio en un año?",
    answer: 89,
    explanation: "Un peruano consume en promedio 89 litros de Coca-Cola al año, según estadísticas de consumo per cápita.",
    category: "Demografía"
  },
  {
    question: "¿Cuántos habitantes tiene la ciudad más poblada del mundo, Tokio?",
    answer: 37400000,
    explanation: "Tokio tiene aproximadamente 37.4 millones de habitantes en su área metropolitana, siendo la ciudad más poblada del mundo.",
    category: "Demografía"
  },
  {
    question: "¿Cuántos años es la esperanza de vida promedio en Japón?",
    answer: 84,
    explanation: "Japón tiene la esperanza de vida más alta del mundo, con un promedio de 84 años.",
    category: "Demografía"
  },
  {
    question: "¿Cuántos millones de personas viven en la India?",
    answer: 1400,
    explanation: "La India tiene aproximadamente 1,400 millones de habitantes, siendo el país más poblado del mundo.",
    category: "Demografía"
  },
  {
    question: "¿Cuántos años es la edad promedio de matrimonio en España?",
    answer: 33,
    explanation: "En España, la edad promedio para contraer matrimonio es de 33 años.",
    category: "Demografía"
  },
  {
    question: "¿Cuántos millones de personas viven en la Ciudad de México?",
    answer: 22,
    explanation: "La Ciudad de México tiene aproximadamente 22 millones de habitantes en su área metropolitana.",
    category: "Demografía"
  },
  {
    question: "¿Cuántos años es la edad promedio de jubilación en Alemania?",
    answer: 63,
    explanation: "En Alemania, la edad promedio de jubilación es de 63 años.",
    category: "Demografía"
  },
  {
    question: "¿Cuántos millones de personas viven en Brasil?",
    answer: 214,
    explanation: "Brasil tiene aproximadamente 214 millones de habitantes, siendo el país más poblado de América del Sur.",
    category: "Demografía"
  },
  {
    question: "¿Cuántos años es la edad promedio de maternidad en Noruega?",
    answer: 29,
    explanation: "En Noruega, la edad promedio para tener el primer hijo es de 29 años.",
    category: "Demografía"
  },
  {
    question: "¿Cuántos millones de personas viven en Argentina?",
    answer: 45,
    explanation: "Argentina tiene aproximadamente 45 millones de habitantes.",
    category: "Demografía"
  }
]; 