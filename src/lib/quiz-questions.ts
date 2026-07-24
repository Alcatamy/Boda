export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0 to 3
  funFact: string; // Funny trivia shown after answering
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "¿Dónde se conocieron Nadia y Adrián?",
    options: [
      "En un festival de música electrónica",
      "En una ceremonia de premios",
      "En el cumpleaños de un amigo en común",
      "Por una app de citas (y fingen que fue en una cafetería)"
    ],
    correctAnswer: 1,
    funFact: "¡En una ceremonia de premios! Entre aplausos, galardones y elegancia fue donde saltó la verdadera chispa."
  },
  {
    id: 2,
    question: "Si hay un solo mosquito en la habitación por la noche, ¿a quién acribillará sin piedad?",
    options: [
      "A Adrián (tiene la sangre más 'dulce')",
      "A Nadia (es el blanco favorito de cualquier insecto)",
      "Les pica a ambos por igual",
      "Ninguno, duermen con repelente de alta potencia"
    ],
    correctAnswer: 0,
    funFact: "¡A Adrián! Los mosquitos tienen claro cuál es su plato favorito de la noche."
  },
  {
    id: 3,
    question: "Si tuvieran que comer un solo plato el resto de su vida, ¿cuál elegirían de mutuo acuerdo?",
    options: [
      "Pasta",
      "Sushi de salmón y atún",
      "Tacos al pastor bien picantes",
      "Tortilla de patatas (con cebolla, por supuesto)"
    ],
    correctAnswer: 0,
    funFact: "¡La pasta en todas sus variaciones! Podrían alimentarse a base de espaguetis y macarrones los 365 días del año sin cansarse."
  },
  {
    id: 4,
    question: "¿Quién es más probable que se quede dormido a los 10 minutos de empezar una película en Netflix?",
    options: [
      "Adrián (especialmente si es de superhéroes)",
      "Nadia (da igual el género, el sofá la hipnotiza)",
      "Ambos a la vez (dueto de ronquidos suaves)",
      "Ninguno, son búhos y maratonean hasta las 3 AM"
    ],
    correctAnswer: 1,
    funFact: "Nadia defiende que no duerme, 'solo descansa los párpados'."
  },
  {
    id: 5,
    question: "¿Quién tarda más tiempo en arreglarse antes de una fiesta?",
    options: [
      "Adrián, domar su pelo requiere ingeniería avanzada",
      "Nadia, buscando el outfit perfecto",
      "Empate técnico (salen tarde sí o sí)",
      "Ninguno, en 5 minutos están listos en la puerta"
    ],
    correctAnswer: 0,
    funFact: "¡Adrián! Sus peinados y retoques de última hora requieren una precisión digna de cirujano."
  },
  {
    id: 6,
    question: "¿Quién es más probable que vaya al supermercado a comprar leche y vuelva con la leche y tres bolsas llenas de caprichos?",
    options: [
      "Adrián (se distrae con cualquier snack o novedad tecnológica)",
      "Nadia (las ofertas y las cosas ricas la pierden por el camino)",
      "Ambos son súper estrictos con la lista de la compra",
      "Hacen la compra online para evitar tentaciones"
    ],
    correctAnswer: 1,
    funFact: "¡Nadia! Entrar al súper a por un cartón de leche es la excusa perfecta para descubrir nuevos productos y caprichos."
  },
  {
    id: 7,
    question: "¿Cuál es el destino de luna de miel soñado por ambos?",
    options: [
      "Aventura y playas en el paraíso asiático",
      "Aventura y templos en Japón",
      "Ruta gastronómica por la Toscana",
      "Un resort todo incluido para no moverse de la hamaca"
    ],
    correctAnswer: 0,
    funFact: "¡Aventura y playas en el paraíso asiático! El viaje perfecto combinando exploración y relax total."
  },
  {
    id: 8,
    question: "¿Quién tiene el peor sentido de la orientación?",
    options: [
      "Adrián (se pierde en su propio barrio)",
      "Nadia (el GPS le habla en chino)",
      "Ambos (Google Maps es el verdadero padrino de bodas)",
      "Tienen una brújula interna infalible"
    ],
    correctAnswer: 1,
    funFact: "¡Nadia se pierde incluso con el GPS puesto en su propia calle! Menos mal que Adrián posee un GPS satelital integrado e infalible."
  },
  {
    id: 9,
    question: "¿Qué es lo que más le saca de quicio a Nadia de Adrián?",
    options: [
      "Que la tenga siempre esperando diciendo '¡ya voy, me queda 1 minuto!'",
      "Que tarde tanto en decidir qué peli ver",
      "Que le robe patatas fritas cuando ella dijo que no quería",
      "Que ponga 5 alarmas cada mañana con 5 minutos de diferencia"
    ],
    correctAnswer: 0,
    funFact: "¡La mítica frase 'ya salgo, me quedan 30 segundos' de Adrián, que misteriosamente se transforman en 20 minutos de espera!"
  },
  {
    id: 10,
    question: "¿Y qué es lo que más le saca de quicio a Adrián de Nadia?",
    options: [
      "Que le robe su sitio favorito en el sofá en cuanto se levanta un segundo",
      "Que haga -10 °C en la calle y abra todas las ventanas de la casa durante 3 horas para ventilar",
      "Que use su taza favorita de café",
      "Que tarde 45 minutos en elegir plato en el restaurante"
    ],
    correctAnswer: 1,
    funFact: "¡Ventilar a temperatura polar! Adrián debe ponerse el abrigo dentro de casa en pleno invierno mientras Nadia renueva el aire."
  },
  {
    id: 11,
    question: "¿Quién es el más ordenado de la casa?",
    options: [
      "Adrián (todo organizado por colores, tamaños y fechas)",
      "Nadia (su nivel de orden es supremo y sabe las coordenadas exactas de todo)",
      "Los dos son muy caóticos (su casa es una zona de guerra pacífica)",
      "Tienen una rutina impecable de limpieza compartida"
    ],
    correctAnswer: 1,
    funFact: "¡Nadia tiene un radar milimétrico para el orden! Sabe la posición exacta de cada objeto en la casa sin dudar un segundo."
  },
  {
    id: 12,
    question: "¿Quién es más probable que empiece a llorar primero durante la ceremonia?",
    options: [
      "Adrián, es un sentimental camuflado de tío duro",
      "Nadia, las emociones fuertes la desarman en segundos",
      "Los dos a la vez, será un mar de lágrimas y pañuelos",
      "Ninguno, se han prometido aguantar el tipo con risas"
    ],
    correctAnswer: 2,
    funFact: "Comprad pañuelos en pack familiar, los vais a necesitar."
  },
  {
    id: 13,
    question: "¿Cuál es su plan favorito para un domingo de lluvia?",
    options: [
      "Salir a hacer senderismo con chubasquero",
      "Café calentito, mantita, maratón de series/pelis y juegos de mesa",
      "Ir al cine a ver una peli y comer palomitas gigantes",
      "Limpieza general profunda de toda la casa"
    ],
    correctAnswer: 1,
    funFact: "Los domingos de mantita, café y maratonear 10 temporadas seguidas sin levantarse del sofá no se cambian por nada."
  },
  {
    id: 14,
    question: "¿Quién es el adicto a las compras online / mejor amigo del repartidor de Amazon?",
    options: [
      "Adrián (aparatos tecnológicos que usará una sola vez)",
      "Nadia (decoración, plantas y cosas bonitas para la casa)",
      "Ambos por igual (el cartero ya es casi un testigo de boda)",
      "Son súper ahorradores y lo compran todo en tiendas físicas"
    ],
    correctAnswer: 2,
    funFact: "¡Empate técnico! Entre la tecnología de Adrián y la decoración de Nadia, el repartidor de Amazon ya saluda por su nombre de pila."
  },
  {
    id: 15,
    question: "¿Cómo se reparten la tarea de hacer la maleta antes de un viaje?",
    options: [
      "Nadia la hace con dos semanas de antelación y Adrián 10 minutos antes de salir hacia el aeropuerto",
      "Adrián la planifica con Excel por outfits y Nadia mete cosas al azar en el último momento",
      "Ambos la hacen la noche de antes deprisa y corriendo",
      "Viajan siempre ligeros con una sola mochila compartida"
    ],
    correctAnswer: 0,
    funFact: "¡Nadia es la previsión en persona! Adrián prefiere la adrenalina de hacerla al límite del tiempo."
  }
];
