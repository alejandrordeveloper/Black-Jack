var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0;

var hidden;
var deck;

var canHit = true; //allows the player (you) to draw while yourSum <= 21

// para cuando la pagina cargue

window.onload = function () {
  buildDeck();
  shuffleDeck();
  startGame();
};

// crear la funcion de BuildDeck
function buildDeck() {
  let values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  let types = ["C", "D", "H", "S"];
  deck = [];

  for (let i = 0; i < types.length; i++) {
    for (let j = 0; j < values.length; j++) {
      deck.push(values[j] + "-" + types[i]); //a-c, k-c, a-d, k-d
    }
  }
  //   console.log(deck);
}

// mirar todas las cartas en el deck y barajearlas

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length); // (0-1)*52= (0-51.99999) y el math.floor nos quita el decimal y nos da el numero entero
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  console.log(deck);
}

function startGame() {
  hidden = deck.pop(); // pop va remover la carta del final del array
  dealerSum += getValue(hidden); //queremos el valor de lacarta hidden y por eso usamos getvalue para pasarle valor
  dealerAceCount += checkAce(hidden);
  //   console.log(hidden);
  //   console.log(dealerSum);
  while (dealerSum < 17) {
    // creamos un tag de imagen y incrementamos la cuenta del dealersum y dealeracecount y usamos el append para unir todas las cartas hasta que el dealer tenga una cuenta mayor a 17
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").append(cardImg);
  }
  console.log(dealerSum);

  for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
  }
  console.log(yourSum);
  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stay").addEventListener("click", stay);
}

function hit() {
  if (!canHit) {
    return;
  }

  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./cards/" + card + ".png";
  yourSum += getValue(card);
  yourAceCount += checkAce(card);
  document.getElementById("your-cards").append(cardImg);

  if (reduceAce(yourSum, yourAceCount) > 21) {
    //A, J, K -> 11 + 10 + 10
    canHit = false;
  }
}

function stay() {
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  yourSum = reduceAce(yourSum, dealerAceCount);

  canHit = false;
  document.getElementById("hidden").src = "./cards/" + hidden + ".png";

  let message = "";
  if (yourSum > 21) {
    message = "You Lose!";
  } else if (dealerSum > 21) {
    message = "You Win!";
  }
  // si tu y el dealer tienen la misma suma empatan
  else if (yourSum == dealerSum) {
    message = "Tie!";
  } else if (yourSum > dealerSum) {
    message = "You Win!";
  } else if (yourSum < dealerSum) {
    message = "You Lose!";
  }
  document.getElementById("dealer").innerText = dealerSum;
  document.getElementById("your").innerText = yourSum;
  document.getElementById("results").innerText = message;
}

function getValue(card) {
  let data = card.split("-"); // "3-c" -> ["3", "c"]
  let value = data[0];

  if (isNaN(value)) {
    // A= 11-1, || J, Q, K= 10
    if (value == "A") {
      return 11;
    }
    return 10;
  }
  // sino recibimos ningun valor es que tenemos un numero y va retornar el digito que sea el numero
  return parseInt(value);
}

function checkAce(card) {
  if (card[0] == "A") {
    return 1;
  }
  return 0;
}

function reduceAce(playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
}
