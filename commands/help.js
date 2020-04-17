const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    
    let helpMessage = "**Available commands:**\n" +
    `\`\`${client.config.prefix}country <country>\`\`: Displays current COVID-19 information in the specified country\n` +
    `\`\`${client.config.prefix}continent <continent>\`\`: Displays current COVID-19 information in the specified continent\n` +
    `\`\`${client.config.prefix}world\`\`: Displays current COVID-19 information in the world\n` +
    `\`\`${client.config.prefix}help\`\`: Shows this message`;

    message.channel.send(helpMessage);
    
}

module.exports.info = {
    name: "help"
}
