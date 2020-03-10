const Discord = require('discord.js');
const https = require('https');

module.exports.run = async (client, message, args) => {
    if (args.length != 1) return message.reply(`Usage: ${client.config.prefix}country <country code>`);
    https.get('https://corona.lmao.ninja', {}, res => {
        let data = '';

        res.on('data', chunk => {
            data += chunk;
        });

        res.on('end', () => {
            let dataJSON = JSON.parse(data);
            let dataCountry = dataJSON.filter(obj => {
                return obj.country === args[0]
            });
            if (!dataCountry) return message.reply(`Country code is invalid. For list of country codes, use ${client.config.prefix}countrycodes`);

            let embed = new Discord.MessageEmbed()
                .setTitle(`Coronavirus outbreak in ${args[0]}`)
                .setTimestamp(Date.now())
                .addField('Total cases', dataCountry.cases, true)
                .addField('Today\'s cases', dataCountry.todayCases, true)
                .addField('Recovered', dataCountry.recovered)
                .addField('Critical', dataCountry.critical)
                .addField('Deaths', dataCountry.deaths, true)
                .addField('Today\'s deaths', dataCountry.todayDeaths, true);
            message.channel.send(embed);
        });
    });
}

module.exports.info = {
    name: "country"
}
