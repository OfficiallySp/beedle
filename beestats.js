// Bee stats for Stat Guess Mode
const beeStats = {
    "basic": {
        name: "Basic",
        color: "Colorless",
        rarity: "Common",
        attack: 1,
        energy: 20,
        speed: 14,
        gifted_ability: "1.2x pollen"
    },
    "bomber": {
        name: "Bomber",
        color: "Colorless",
        rarity: "Rare",
        attack: 2,
        energy: 20,
        speed: 15.4,
        gifted_ability: "1.1x bomb pollen"
    },
    "brave": {
        name: "Brave",
        color: "Colorless",
        rarity: "Rare",
        attack: 6,
        energy: 30,
        speed: 16.8,
        gifted_ability: "+1 bee attack"
    },
    "bumble": {
        name: "Bumble",
        color: "Blue",
        rarity: "Rare",
        attack: 1,
        energy: 40,
        speed: 10.5,
        gifted_ability: "1.1x capacity"
    },
    "cool": {
        name: "Cool",
        color: "Blue",
        rarity: "Rare",
        attack: 2,
        energy: 20,
        speed: 14,
        gifted_ability: "1.1x blue pollen"
    },
    "hasty": {
        name: "Hasty",
        color: "Colorless",
        rarity: "Rare",
        attack: 1,
        energy: 20,
        speed: 19.6,
        gifted_ability: "15% player movespeed"
    },
    "looker": {
        name: "Looker",
        color: "Colorless",
        rarity: "Rare",
        attack: 1,
        energy: 20,
        speed: 14,
        gifted_ability: "25% critical power"
    },
    "rad": {
        name: "Rad",
        color: "Red",
        rarity: "Rare",
        attack: 1,
        energy: 20,
        speed: 14,
        gifted_ability: "1.1x red pollen"
    },
    "rascal": {
        name: "Rascal",
        color: "Red",
        rarity: "Rare",
        attack: 3,
        energy: 20,
        speed: 16.1,
        gifted_ability: "1.25x red bomb pollen"
    },
    "stubborn": {
        name: "Stubborn",
        color: "Colorless",
        rarity: "Rare",
        attack: 2,
        energy: 20,
        speed: 11.9,
        gifted_ability: "15% ability token lifespan"
    },
    "bubble": {
        name: "Bubble",
        color: "Blue",
        rarity: "Epic",
        attack: 3,
        energy: 20,
        speed: 16.1,
        gifted_ability: "1.25x bubble pollen"
    },
    "bucko": {
        name: "Bucko",
        color: "Blue",
        rarity: "Epic",
        attack: 6,
        energy: 30,
        speed: 15.4,
        gifted_ability: "20% blue field capacity"
    },
    "commander": {
        name: "Commander",
        color: "Colorless",
        rarity: "Epic",
        attack: 4,
        energy: 30,
        speed: 14,
        gifted_ability: "3% critical chance"
    },
    "demo": {
        name: "Demo",
        color: "Colorless",
        rarity: "Epic",
        attack: 3,
        energy: 20,
        speed: 16.8,
        gifted_ability: "1.25x buzz bomb pollen"
    },
    "exhausted": {
        name: "Exhausted",
        color: "Colorless",
        rarity: "Epic",
        attack: 2,
        energy: 999,
        speed: 10.5,
        gifted_ability: "20% white field capacity"
    },
    "fire": {
        name: "Fire",
        color: "Red",
        rarity: "Epic",
        attack: 4,
        energy: 25,
        speed: 11.2,
        gifted_ability: "1.25x flame pollen"
    },
    "frosty": {
        name: "Frosty",
        color: "Blue",
        rarity: "Epic",
        attack: 2,
        energy: 25,
        speed: 11.2,
        gifted_ability: "1.25x blue bomb pollen"
    },
    "honey": {
        name: "Honey",
        color: "Colorless",
        rarity: "Epic",
        attack: 2,
        energy: 20,
        speed: 14,
        gifted_ability: "1.5x honey from tokens"
    },
    "rage": {
        name: "Rage",
        color: "Red",
        rarity: "Epic",
        attack: 5,
        energy: 20,
        speed: 15.4,
        gifted_ability: "10% bee attack"
    },
    "riley": {
        name: "Riley",
        color: "Red",
        rarity: "Epic",
        attack: 6,
        energy: 25,
        speed: 15.4,
        gifted_ability: "20% red field capacity"
    },
    "shocked": {
        name: "Shocked",
        color: "Colorless",
        rarity: "Epic",
        attack: 2,
        energy: 20,
        speed: 19.6,
        gifted_ability: "1.1x white pollen"
    },
    "baby": {
        name: "Baby",
        color: "Colorless",
        rarity: "Legendary",
        attack: 0,
        energy: 15,
        speed: 10.5,
        gifted_ability: "+25% loot luck"
    },
    "carpenter": {
        name: "Carpenter",
        color: "Colorless",
        rarity: "Legendary",
        attack: 5,
        energy: 25,
        speed: 11.2,
        gifted_ability: "+25% tool pollen"
    },
    "demon": {
        name: "Demon",
        color: "Red",
        rarity: "Legendary",
        attack: 8,
        energy: 20,
        speed: 10.5,
        gifted_ability: "+20% instant bomb conversion"
    },
    "diamond": {
        name: "Diamond",
        color: "Blue",
        rarity: "Legendary",
        attack: 1,
        energy: 20,
        speed: 14,
        gifted_ability: "1.2x convert rate"
    },
    "lion": {
        name: "Lion",
        color: "Colorless",
        rarity: "Legendary",
        attack: 10,
        energy: 60,
        speed: 19.6,
        gifted_ability: "+5% gifted bee pollen"
    },
    "music": {
        name: "Music",
        color: "Colorless",
        rarity: "Legendary",
        attack: 1,
        energy: 20,
        speed: 16.1,
        gifted_ability: "+25% pollen from bee gathering"
    },
    "ninja": {
        name: "Ninja",
        color: "Blue",
        rarity: "Legendary",
        attack: 4,
        energy: 20,
        speed: 21,
        gifted_ability: "+5% bee movespeed"
    },
    "shy": {
        name: "Shy",
        color: "Red",
        rarity: "Legendary",
        attack: 2,
        energy: 40,
        speed: 18.2,
        gifted_ability: "+5% bee ability pollen"
    },
    "buoyant": {
        name: "Buoyant",
        color: "Blue",
        rarity: "Mythic",
        attack: 4,
        energy: 60,
        speed: 14,
        gifted_ability: "1.2x capacity"
    },
    "fuzzy": {
        name: "Fuzzy",
        color: "Colorless",
        rarity: "Mythic",
        attack: 3,
        energy: 50,
        speed: 11.9,
        gifted_ability: "1.2x bomb power"
    },
    "precise": {
        name: "Precise",
        color: "Red",
        rarity: "Mythic",
        attack: 8,
        energy: 40,
        speed: 11.2,
        gifted_ability: "+3% super-crit chance"
    },
    "spicy": {
        name: "Spicy",
        color: "Red",
        rarity: "Mythic",
        attack: 5,
        energy: 20,
        speed: 14,
        gifted_ability: "+25% flame duration"
    },
    "tadpole": {
        name: "Tadpole",
        color: "Blue",
        rarity: "Mythic",
        attack: 1,
        energy: 10,
        speed: 11.2,
        gifted_ability: "25% bubble duration"
    },
    "vector": {
        name: "Vector",
        color: "Colorless",
        rarity: "Mythic",
        attack: 5,
        energy: 45.6,
        speed: 16.24,
        gifted_ability: "+15% mark duration"
    },
    "bear": {
        name: "Bear",
        color: "Colorless",
        rarity: "Event",
        attack: 5,
        energy: 35,
        speed: 14,
        gifted_ability: "+10% pollen"
    },
    "cobalt": {
        name: "Cobalt",
        color: "Blue",
        rarity: "Event",
        attack: 7,
        energy: 35,
        speed: 18.2,
        gifted_ability: "+15% instant blue conversion"
    },
    "crimson": {
        name: "Crimson",
        color: "Red",
        rarity: "Event",
        attack: 7,
        energy: 35,
        speed: 18.2,
        gifted_ability: "+15% instant red conversion"
    },
    "digital": {
        name: "Digital",
        color: "Colorless",
        rarity: "Event",
        attack: 1,
        energy: 20,
        speed: 11.9,
        gifted_ability: "+1% ability duplication chance"
    },
    "festive": {
        name: "Festive",
        color: "Red",
        rarity: "Event",
        attack: 1,
        energy: 20,
        speed: 16.1,
        gifted_ability: "1.25x convert rate at hive"
    },
    "gummy": {
        name: "Gummy",
        color: "Colorless",
        rarity: "Event",
        attack: 4,
        energy: 50,
        speed: 14,
        gifted_ability: "5% honey per pollen"
    },
    "photon": {
        name: "Photon",
        color: "Colorless",
        rarity: "Event",
        attack: 4,
        energy: 999,
        speed: 21,
        gifted_ability: "+5% instant conversion"
    },
    "puppy": {
        name: "Puppy",
        color: "Colorless",
        rarity: "Event",
        attack: 2,
        energy: 40,
        speed: 16.1,
        gifted_ability: "+20% bond from treats"
    },
    "tabby": {
        name: "Tabby",
        color: "Colorless",
        rarity: "Event",
        attack: 4,
        energy: 28,
        speed: 16.1,
        gifted_ability: "+50% critical power"
    },
    "vicious": {
        name: "Vicious",
        color: "Blue",
        rarity: "Event",
        attack: 9,
        energy: 50,
        speed: 17.5,
        gifted_ability: "-15% monster respawn times"
    },
    "windy": {
        name: "Windy",
        color: "Colorless",
        rarity: "Event",
        attack: 4,
        energy: 20,
        speed: 19.6,
        gifted_ability: "+15% instant white conversion, x2 boosts from clouds"
    }
};
