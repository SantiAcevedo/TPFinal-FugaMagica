export const gameOptions = {
    firstPlatformPosition: -120 / 20, // primer posicion vertical de la plataforma. 0 = parte superior de la pantalla, 1 = parte inferior de la pantalla
    gameGravity: 1200, // gravedad del juego, que solo afecta al player
    heroSpeed: 300, // velocidad del jugador, en pixeles por segundo
    platformSpeed: 190, // velocidad de las plataformas, en pixeles por segundo
    platformLengthRange: [50, 150], // longitud de las plataformas, en pixeles
    platformHorizontalDistanceRange: [0, 250], // rango de distancia horizontal de la plataforma desde el centro del escenario, en pixeles
    platformFixedLength: 150, // Nueva opción para establecer un tamaño fijo para las plataformas
    jumpForce: 800, // Fuerza del salto
    platformVerticalDistanceRange: [0, 300] // rango de distancia vertical de la plataforma desde la plataforma anterior, en pixeles 
}
