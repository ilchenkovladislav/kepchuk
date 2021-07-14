const { default: fetch } = require("node-fetch");

function formattingText(text) {
    return `**\`\`` + text + `\`\`**`;
}

function random(bot, message, args) {
    let randomIdx = Math.floor(Math.random() * args.length);
    message.channel.send(args[randomIdx]);
}

function getRandomNumber(args) {
    switch (args.length) {
        case 0:
            return Math.floor(Math.random() * 101);
        case 1:
            return Math.floor(Math.random() * (Number(args[0]) + 1));
        case 2:
            return Math.floor(Math.random() * (Number(args[1]) - Number(args[0]) + 1)) + Number(args[0]);
    }
}

function getRollMessage(args) {
    switch (args.length) {
        case 0:
            return "Ролл от 0 до 100"
        case 1:
            return `Ролл от 0 до ${args[0]}`
        case 2:
            return `Ролл от ${args[0]} до ${args[1]}`
    }
}

function isCorrectRoll(args) {
    if (args.length === 0) {
        return true;
    } else if(args.length === 1 && Number(args[0]) > 0) {
        return true;
    } else if (args.length === 2 && Number(args[0]) < Number(args[1])) {
        return true;
    }

    return false;
}

function roll(bot, message, args) {
    if (!isCorrectRoll(args)) {
        message.channel.send("Некорректные данные");
        return;
    }
    
    let outputTemplate = `У ${message.author}: `;

    let randomNumber = getRandomNumber(args);

    let rollMessage = getRollMessage(args);


    message.channel.send(rollMessage);
    message.channel.send(outputTemplate + formattingText(randomNumber));
}

function wakeUp(bot, message, args) {
    var mentioned = message.mentions.members.first();

    if (mentioned != undefined) {
        if (args[1] == undefined){
            mentioned.send("."); mentioned.send("."); mentioned.send("."); mentioned.send(".");
            mentioned.send(message.author.username + " пытается разбудить вас");
            message.channel.send("Пытаюсь разбудить " + mentioned.user.username);
        }
    } else {
        message.channel.send("Укажите через @ кого нужно разбудить");
    }   
}

function getRandomHero(bot, message, args) {
    fetch("https://api.opendota.com/api/heroes")
        .then(response => response.json())
        .then(heroes => {
            let randomIdx = Math.floor(Math.random() * (heroes.length + 1));
            let hero = heroes[randomIdx];

            message.channel.send(`У ${message.author}: ${hero.localized_name}`);
        }
    );
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function getRoles(bot, message, args) {
    if (args.length > 5 || args.length == 0) {
        message.channel.send("Некорректные данные");
        return;
    }

    const roles = ["Керри", "Мид", "Хард", "Пятерка", "Четверка"];

    let shuffleRoles = shuffle(roles);
    
    let resultText = "\nРоли: \n";

    args.forEach((men, index) => {
        resultText += `${men} - ${shuffleRoles[index]}\n`;
    });

    message.channel.send(`**\`\`\` ${resultText} \`\`\`**`);
}

let commands = [
    {
        name: "random",
        out: random,
        about: "Выбор рандомного элемента из написанных"
    },
    {
        name: "roll",
        out: roll,
        about: "roll"
    },
    {
        name: "wakeup",
        out: wakeUp,
        about: "wakeup"
    },
    {
        name: "hero",
        out: getRandomHero,
        about: "random hero dota2"
    },
    {
        name: "roles",
        out: getRoles,
        about: "random roles dota2"
    },
];

module.exports.commands = commands;