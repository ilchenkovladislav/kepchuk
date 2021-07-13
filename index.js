const Discord = require('discord.js');
const bot = new Discord.Client(); 
const fs = require('fs');

const commands = require("./commands.js");

let config = require('./config.json');
let token = config.token;
let prefix = config.prefix;

bot.on("ready", function() {
  console.log(bot.user.username + " запустился!");
});


bot.on("message", (msg) => {
  if (msg.author.username != bot.user.username && msg.author.discriminator != bot.user.discriminator) {
    let userMessage = msg.content.trim();

    let [inputCommand, ...args] = userMessage.split(" ");

    for (currentCommand of commands.commands) {
      let prefixedCurrentCommand = prefix + currentCommand.name;

      if (prefixedCurrentCommand == inputCommand) {
        currentCommand.out(bot, msg, args);
      }
    }
  }
});

bot.on("voiceStateUpdate", (oldState, newState) => {
  if(!oldState.channel && newState.channel) {
    let textChannelId = newState.channel.guild.systemChannelID;
    bot.channels.fetch(textChannelId).then(response => response.send(`${newState.member.displayName} зашел в дис`));
  } 
});


bot.login(token);