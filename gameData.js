// JavaScript Document

export const bees = [
    "Basic", "Bomber", "Brave", "Bumble", "Cool",
    "Hasty", "Looker", "Rad", "Rascal", "Stubborn",
    "Bubble", "Bucko", "Commander", "Demo", "Exhausted",
    "Fire", "Frosty", "Honey", "Rage", "Riley", "Shocked",
    "Baby", "Carpenter", "Demon", "Diamond", "Lion", "Music",
    "Ninja", "Shy", "Buoyant", "Fuzzy", "Precise", "Spicy",
    "Tadpole", "Vector", "Bear", "Cobalt", "Crimson", "Digital",
    "Festive", "Gummy", "Photon", "Puppy", "Tabby", "Vicious", "Windy"
];

export const sounds = {
    correct: new Audio('sound/correct.mp3'),
    incorrect: new Audio('sound/incorrect.mp3'),
    flip: new Audio('sound/flip.mp3'),
    letterCorrect: new Audio('sound/letter_correct.mp3'),
    letterPresent: new Audio('sound/letter_present.mp3')
};

// Preload sounds
Object.values(sounds).forEach(sound => {
    sound.load();
});