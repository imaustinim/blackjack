// Deck Components
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['&#9824', '&#9827', '&#9829', '&#9670'];

// Classes
class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
        this.value = this.getValue();
    }

    getValue() {
        let v;
        let r = this.rank;
        if(r === 'A') {
            v = 11;
        } else if(r === 'J' || r === 'Q' || r === 'K') {
            v = 10;
        } else {
            v = parseInt(r);
        }
        return v;
    }
}

class Deck {
    constructor() {
        this.deck = [];
        }

    createDeck(suits, ranks) {
        for(let suit of suits) {
            for(let rank of ranks) {
                this.deck.push(new Card(suit, rank));

            }
        }
        return this.deck;
    }

    shuffle() {
        let counter = this.deck.length, temp, i;
        while (counter) {
            i = Math.floor(Math.random() * counter--);
            temp = this.deck[counter];
            this.deck[counter] = this.deck[i];
            this.deck[i] = temp;
        }
        return this.deck;
    }

    deal(player) {
        player.hand.push(this.deck.pop());
    }
}

class Player {
    constructor(name) {
        this.hand = [];
        this.name = name;
    }

    getValue() {
        let totalValue = 0;
        for (let card of this.hand) {
            totalValue += card.value;
        }
        
        if (totalValue <= 21) {
            return totalValue;
        } 
        else {
            let ace = this.hand.find(card => card.rank == "A");
            if (ace) {
                ace.value = 1;
                ace.rank = '1';
                return this.getValue();          
            } else {
                return totalValue;
            }
        }
    }
}


// Setup
let deck = new Deck();
let dealer = new Player("dealer-cards");
let user = new Player("user-cards");
const dealer_cards = document.getElementById("dealer-cards");
const player_cards = document.getElementById("user-cards");

// On Click Handlers
const deal_button = document.getElementById("deal");
const hit_button = document.getElementById("hit");
const stand_button = document.getElementById("stand");

deal_button.onclick = () => {
    resetGame();

    const holder = document.querySelector(".holder");
    deck.createDeck(suits, ranks);
    deck.shuffle();

    deck.deal(dealer);
    dealCard(dealer);
    deal_animation(document.getElementById(dealer.name).lastChild, 0);
    displayValue(dealer);
    
    deck.deal(user);
    dealCard(user);
    deal_animation(document.getElementById(user.name).firstChild, 250);
    displayValue(user);
    
    deck.deal(user);
    dealCard(user);
    deal_animation(document.getElementById(user.name).lastChild, 500);
    displayValue(user);

    deal_button.disabled = true;
    hit_button.disabled = false;
    stand_button.disabled = false;

    const user_value = user.getValue();
    if (user_value == 21) {
        stand(250);
        displayValue(user)
    }
}


hit_button.onclick = () => {
    deck.deal(user);
    dealCard(user);
    deal_animation(document.getElementById(user.name).lastChild, 0);
    displayValue(user);

    const user_value = user.getValue();
    if (user_value > 21) {
        compare();
    } else if (user_value == 21) {
        stand(250);
    } 
}

//Callable Functions
function stand (ms) {
        deck.deal(dealer);
        dealCard(dealer);    
        deal_animation(document.getElementById(dealer.name).lastChild, ms);
        displayValue(dealer);

        ms += 250;
        const dealer_value = dealer.getValue();
        if (dealer_value >= 17) {    
            compare();   
            resetButtons();        
        } else {
            stand(ms);
        }
    }

stand_button.onclick = () => {
    stand(250);
}

function compare() {
    const dealer_value = dealer.getValue();
    const user_value = user.getValue();

    const alert = document.getElementById("alert");
    $("#alert").delay(750).fadeTo(1000,1);
    if (dealer_value > user_value) {
        if (dealer_value > 21) {
            alert.innerHTML = "Dealer busts, you win!";
        } else {
            alert.innerHTML = "Dealer wins, you lose!";
        }
    } else if (dealer_value < user_value) {
        if (user_value > 21) {
            alert.innerHTML = "Bust, dealer wins!";
        } else if (user_value == 21) {
            alert.innerHTML = "Blackjack, you win!";
        } else {
            alert.innerHTML = "You win, dealer loses!";
        }
    } else if (dealer_value == user_value) {
        alert.innerHTML = "Tie game";
    }
    resetButtons();
}

function resetButtons () {
    deal_button.disabled = false;
    hit_button.disabled = true;
    stand_button.disabled = true;
}

function resetGame () {
    $("#alert").fadeTo(1000,0);
    dealer.hand = [];
    user.hand = [];
    removeChildren(dealer_cards);
    removeChildren(player_cards);
}

function removeChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

//Create Elements
function dealCard(player) {
    const cards = document.getElementById(player.name);

    const newCard = document.createElement("div");
    const rank1 = document.createElement("div");
    const suit = document.createElement("div");
    const rank2 = document.createElement("div");

    newCard.classList.add("card");
    newCard.style.opacity = 0;
    newCard.style.position = "relative";
    if (window.matchMedia("(max-width: 959px").matches) {
        newCard.style.left = "120vw";
    } else {
        newCard.style.left = "1152px";
    }

    rank1.classList.add("card-rank", "top-left");
    suit.classList.add("card-suit");
    rank2.classList.add("card-rank", "bottom-right");

    const card = player.hand[player.hand.length - 1];
    rank1.innerHTML = card.rank;
    suit.innerHTML = card.suit;
    rank2.innerHTML = card.rank;

    cards.appendChild(newCard);
    newCard.appendChild(rank1);
    newCard.appendChild(suit);
    newCard.appendChild(rank2);

}

function deal_animation(element, ms) {
    $(element).fadeTo(500,1);
    if (window.matchMedia("(max-width: 959px").matches) {
        $(element).delay(ms).animate({
            "left": "0vw"
        }, 200);
        $(".card:not(:first-child)").animate({
            "margin-left": "-16vw"
        }, 200);
    } else {
        $(element).delay(ms).animate({
            "left": "0px"
        }, 200);
        $(".card:not(:first-child)").animate({
            "margin-left": "-153.6px"
        }, 200);
    }
}

function displayValue(player) {
    let element;
    let str;
    if (player.name == "dealer-cards") {
        element = document.getElementById("dealer-value");
        str = "Dealer Value: ";
    } else {
        element = document.getElementById("user-value")
        str = "User Value: ";
    }
    $(element).delay(500).fadeTo(500,1);
    element.innerHTML = str + player.getValue();
}