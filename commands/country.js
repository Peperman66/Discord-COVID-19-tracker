const Discord = require('discord.js');
const https = require('https');

module.exports.run = async (client, message, args) => {
    if (args.length < 1) return message.reply(`Usage: \`\`${client.config.prefix}country <country code>\`\``);
    let countryString = args.join(" ");

    let tempMessage = await message.channel.send('Requesting data...');

    https.get('https://corona.lmao.ninja/v2/countries', {}, res => {
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
            let dataCountry = dataJSON.filter(obj => {
                return obj.country.toLowerCase() === countryString.toLowerCase();
            });
            if (dataCountry.length === 0) return tempMessage.edit(`Country code is invalid. For list of country codes, use \`\`${client.config.prefix}countrycodes\`\``);
            dataCountry = dataCountry[0]
            let embed = new Discord.MessageEmbed()
                .setTitle(`Coronavirus outbreak in ${dataCountry.country} (${dataCountry.countryInfo.iso3})`)
                .setThumbnail(dataCountry.countryInfo.flag)
                .addField('Total cases', dataCountry.cases, true)
                .addField('Today\'s cases', dataCountry.todayCases, true)
                .addField('Cases per one million', dataCountry.casesPerOneMillion, true)
                .addField('Deaths', dataCountry.deaths, true)
                .addField('Today\'s deaths', dataCountry.todayDeaths, true)
                .addField('Deaths per one million', dataCountry.deathsPerOneMillion, true)
                .addField('Tests', dataCountry.tests, true)
                .addField('\u200B', '\u200B', true)
                .addField('Tests per one million', dataCountry.testsPerOneMillion, true)
                .addField('\u200B', '\u200B', false)
                .addField('Recovered', dataCountry.recovered, true)
                .addField('Critical', dataCountry.critical, true)
                .addField('Active', dataCountry.active, true)
                .setFooter('Last updated')
                .setTimestamp(dataCountry.updated);
            message.channel.send(embed);
            tempMessage.delete({timeout: 5000});
        });

        res.on('error', (err) => {
            console.log(err);
            tempMessage.edit('Something went wrong. Please try again later.');
        })
    });
}

module.exports.info = {
    name: "country"
}
