const Discord = require('discord.js');
const fs = require('fs');
const path = require('path')

const client = new discord.Client();
const config = require('./config.json');
client.config = config;

client.commands = new Discord.Collection();

//loading command handler
fs.readdir(client.config.commandDir, (err, files) => {
    if (err) return console.log(err);

    let jsFiles = files.filter(f => f.split('.').pop() === 'js');
    if (jsFiles.length <= 0) return console.log("Could not find any commands!");

    jsFiles.forEach(file => {
        let props = require(path.join(client.config.commandDir, file));
        let commandName = props.info.name;
        client.commands.set(commandName, props);
    });
});

client.on('error', error => console.log(error));

