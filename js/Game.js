class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    this.LeaderboardTitle = createElement("h2");
    this.Leader1 = createElement("h2");
    this.Leader2 = createElement("h2");
  }
  
 
  start(){
    form = new Form();
    form.display();
    car1 = createSprite(width/2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width/2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];

    player = new Player();
    playerCount = player.getCount();
  }

  getState(){
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data){
      gameState = data.val();
    })
  }
  update (state){
    database.ref("/").update({
      gameState: state
    })
  }
  handleElements(){
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect")
    this.resetTitle.html("Reiniciar juego");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width/2 + 200, 40);
   
    this.resetButton.class("resetButton")
    this.resetButton.position(width/2 + 230, 100);
    
    this.LeaderboardTitle.html("Puntuación");
    this.LeaderboardTitle.class("resetText");
    this.LeaderboardTitle.position(width/3 - 60, 40);
  
    this.Leader1.class("leadersText");
    this.Leader1.position(width/3 - 50, 80);

    this.Leader2.class("leadersText");
    this.Leader2.position(width/3 - 50, 130);

  }
  play(){
    this.handleElements();
    this.handleResetButton();
    Player.getPlayersInfo();
    if(allPlayers !== undefined){
      image(track, 0, -height * 5, width, height *6);
      //indice de la matriz
      var index = 0;
      for(var plr in allPlayers){
        //agregar un 1 al indice para cada bucle
        index = index + 1;
        //utilizar datos de la base de datos para mostrar los autos en las direcciones de "x" e "y"
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;
        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;
        if(index === player.index){
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
          //cambiar la posicion de la camara en la direccion de "y"
          camera.position.x = cars[index-1].position.x;
          camera.position.y = cars[index-1].position.y;
        }
      }
      this.handlePlayerControls();
      drawSprites();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() =>{
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {}
      });
      window.location.reload();
    })
  }
  handlePlayerControls(){
    //manejar eventos del teclado
    if(keyIsDown(UP_ARROW)){
      player.positionY += 10;
      player.update();
    }    
  }
}
