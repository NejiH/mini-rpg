let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["baton"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
    { name: 'baton', power: 5 },
    { name: 'dague', power: 30 },
    { name: 'masse', power: 50 },
    { name: 'epee', power: 100 }
];

const monsters = [
    {
        name: "Slime",
        level: 2,
        health: 15
    },
    {
        name: "Bete sauvage",
        level: 8,
        health: 60
    },
    {
        name: "Dragon",
        level: 20,
        health: 300
    }
]

const locations = [
    {
        name: "place du village",
        "button text": ["Aller au magasin", "Aller a la grotte", "Combatre le Dragon"],
        "button functions": [gomagasin, gogrotte, fightDragon],
        text: "Vous êtes sur la place du village. Vous voyez un panneau sur lequel est ecrit \"magasin\"."
    },
    {
        name: "magasin",
        "button text": ["Acheter 10 PV (10 or)", "Acheter une armne (30 or)", "Retourner au village"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "Vous entrez dans le magasin."
    },
    {
        name: "grotte",
        "button text": ["Combattre une slime", "Combattre une bete sauvage", "Retourner au village"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "Vous entrez dans la grotte. Vous voyez un monstre."
    },
    {
        name: "combat",
        "button text": ["Attaque", "Esquive", "Fuite"],
        "button functions": [attack, dodge, goTown],
        text: "Vous affrontez un monstre."
    },
    {
        name: "tuer un monstre",
        "button text": ["Retourner au village", "Retourner au village", "Retourner au village"],
        "button functions": [goTown, goTown, goTown],
        text: 'Le monstre crie « Arg ! » en mourant. Vous gagnez des points d\'expérience et trouvez de l\'or.'
    },
    {
        name: "defaite",
        "button text": ["Rejouer", "Rejouer", "Rejouer"],
        "button functions": [restart, restart, restart],
        text: "Vous etes mort. &#x2620;"
    },
    {
        name: "victoire",
        "button text": ["Rejouer", "Rejouer", "Rejouer"],
        "button functions": [restart, restart, restart],
        text: "Vous avez battu le dragon. Vous avez gagne ! &#x1F389;"
    },
    {
        name: "easter egg",
        "button text": ["2", "8", "Retourner au village ?"],
        "button functions": [pickTwo, pickEight, goTown],
        text: "Vous trouvez un jeu secret. Choisissez un numéro ci-dessus. Des numéros seront choisis au hasard entre 0 et 10. Si le numéro que vous avez choisi correspond a un numéro aléatoire, vous gagnez !"
    }
];

// initialize buttons
button1.onclick = gomagasin;
button2.onclick = gogrotte;
button3.onclick = fightDragon;

function update(location) {
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerHTML = location.text;
}

function goTown() {
    update(locations[0]);
}

function gomagasin() {
    update(locations[1]);
}

function gogrotte() {
    update(locations[2]);
}

function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    } else {
        text.innerText = "Vous n'avez pas assez de d'or pour acheter des PV.";
    }
}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeapon++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "Vous avez une " + newWeapon + ".";
            inventory.push(newWeapon);
            text.innerText += " Dans votre inventaire, vous avez : " + inventory;
        } else {
            text.innerText = "Vous n'avez pas assez d'or pour acheter une arme";
        }
    } else {
        text.innerText = "Vous avez deja l'arme la plus puissante.";
        button2.innerText = "Vendre une arme pour 15 gold";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = "Vous avez vendu une " + currentWeapon + ".";
        text.innerText += " Dans votre inventaire, vous avez : " + inventory;
    } else {
        text.innerText = "Ne vendez pas votre derniere arme.";
    }
}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterName.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}

function attack() {
    text.innerText = "La " + monsters[fighting].name + " vous attaque.";
    text.innerText += " Vous attaquez avec votre " + weapons[currentWeapon].name + ".";
    health -= getMonsterAttackValue(monsters[fighting].level);
    if (isMonsterHit()) {
        monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    } else {
        text.innerText += " Vous loupez.";
    }
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if (health <= 0) {
        lose();
    } else if (monsterHealth <= 0) {
        if (fighting === 2) {
            winGame();
        } else {
            defeatMonster();
        }
    }
    if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerText += " Votre " + inventory.pop() + " est cassee.";
        currentWeapon--;
    }
}

function getMonsterAttackValue(level) {
    const hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit > 0 ? hit : 0;
}

function isMonsterHit() {
    return Math.random() > .2 || health < 20;
}

function dodge() {
    text.innerText = "Vous esquivez l'attaque de la " + monsters[fighting].name;
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}

function lose() {
    update(locations[5]);
}

function winGame() {
    update(locations[6]);
}

function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["baton"];
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    goTown();
}

function easterEgg() {
    update(locations[7]);
}

function pickTwo() {
    pick(2);
}

function pickEight() {
    pick(8);
}

function pick(guess) {
    const numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }
    text.innerText = "Vous avez choisi le " + guess + ". Voici les numeros aleatoires :\n";
    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
    }
    if (numbers.includes(guess)) {
        text.innerText += "Bravo ! Vous gagnez 20 gold !";
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "Perdu ! Vous perdez 10 PV !";
        health -= 10;
        healthText.innerText = health;
        if (health <= 0) {
            lose();
        }
    }
}