const Discord = require('discord.js');
const https = require('https');

module.exports.run = async (client, message, args) => {
    if (args.length < 1) return message.reply(`Usage: \`\`${client.config.prefix}country <country code>\`\``);
    let countryString =encodeURIComponent(args.join(" "));

    let tempMessage = await message.channel.send('Requesting data...');

    https.get(`https://corona.lmao.ninja/v2/countries/${countryString}`, {}, res => {
        let data = '';
        let dataRetrieving = false
        res.on('data', chunk => {
            data += chunk;
            if (!dataRetrieving) {
                tempMessage.edit('Retrieving data...')
                .then(newMessage => tempMessage = newMessage);
                dataRetrieving = true;
            }
        });

        res.on('end', () => {
            tempMessage.edit('Data retrieved!')
                .then(newMessage => tempMessage = newMessage);
                let dataJSON;
            try {
                dataJSON = JSON.parse(data);
            } catch (err) {
                tempMessage.edit('Something went wrong. Please try again later.');
                console.log(err);
                return;
            }
            if (res.statusCode == 404) return tempMessage.edit(`Can't find specified country. Maybe that country has no recorded cases?`);
            if (res.statusCode != 200) return tempMessage.edit('Something went wrong. Please try again later.');
            let embed = new Discord.MessageEmbed()
                .setTitle(`Coronavirus outbreak in ${dataJSON.country} (${dataJSON.countryInfo.iso3})`)
                .setThumbnail(dataJSON.countryInfo.flag)
                .addField('Total cases', dataJSON.cases, true)
                .addField('Today\'s cases', dataJSON.todayCases, true)
                .addField('Cases per one million', dataJSON.casesPerOneMillion, true)
                .addField('Deaths', dataJSON.deaths, true)
                .addField('Today\'s deaths', dataJSON.todayDeaths, true)
                .addField('Deaths per one million', dataJSON.deathsPerOneMillion, true)
                .addField('Tests', dataJSON.tests, true)
                .addField('\u200B', '\u200B', true)
                .addField('Tests per one million', dataJSON.testsPerOneMillion, true)
                .addField('\u200B', '\u200B', false)
                .addField('Recovered', dataJSON.recovered, true)
                .addField('Critical', dataJSON.critical, true)
                .addField('Active', dataJSON.active, true)
                .setFooter('Last updated')
                .setTimestamp(dataJSON.updated);
            message.channel.send(embed);
            tempMessage.delete({timeout: 5000});
        });

        res.on('error', (err) => {
            console.log(err);
            tempMessage.edit('Something went wrong. Please try again later.');
        });
    });
}

module.exports.info = {
    name: "country"
}
