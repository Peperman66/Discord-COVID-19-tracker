const Discord = require('discord.js');
const fs = require('fs');
const path = require('path')

const client = new Discord.Client();
const config = require('./config.json');
client.config = config;

client.commands = new Discord.Collection();

//loading command handler
fs.readdir(client.config.commandDir, (err, files) => {
    if (err) return console.log(err);

    let jsFiles = files.filter(f => f.split('.').pop() === 'js');
    if (jsFiles.length <= 0) return console.log("Could not find any commands!");

    jsFiles.forEach(file => {
        let props = require(path.join(__dirname, client.config.commandDir, file));
        let commandName = props.info.name;
        client.commands.set(commandName, props);
        console.log(`${file} loaded`);
    });
});

client.on('error', error => console.log(error));

client.on('ready', () => {
    client.user.setActivity('the coronavirus outbreak | ,corona help for help', {type: 'WATCHING'});
    console.log('Client logged in!');
});

client.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;

    if (!message.content.startsWith(client.config.prefix)) return;

    let prefix = client.config.prefix;
    let messageArray = message.content.split(' ');
    let cmd = messageArray[1];
    let args = messageArray.splice(2);
    let commandFile = client.commands.get(cmd);
    if (!commandFile) return;
    await commandFile.run(client, message, args)
        .catch((err) => console.log(err));
})

client.login(config.token)
