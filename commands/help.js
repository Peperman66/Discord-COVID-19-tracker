const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    
    let helpMessage = "**Available commands:**\n" +
    `\`\`${client.config.prefix}country <countrycode>\`\`: Displays current COVID-19 information in specified country\n` +
    `\`\`${client.config.prefix}world\`\`: Displays current COVID-19 information in the world\n` + 
    `\`\`${client.config.prefix}countrycodes\`\`: Shows list of all possible countrycodes\n` + 
    `\`\`${client.config.prefix}help\`\`: Shows this message`;

    message.channel.send(helpMessage);
    
}

module.exports.info = {
    name: "help"
}
