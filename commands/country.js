const Discord = require('discord.js');
const https = require('https');

module.exports.run = async (client, message, args) => {
    if (args.length != 1) return message.reply(`Usage: \`\`${client.config.prefix}country <country code>\`\``);

    let tempMessage = await message.channel.send('Requesting data...');

    https.get('https://corona.lmao.ninja/countries', {}, res => {
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
                .then(newMessage => newMessage.delete({ timeout: 1000 }));
                let dataJSON;
            try {
                dataJSON = JSON.parse(data);
            } catch (err) {
                tempMessage.edit('Something went wrong. Please try again later.');
                console.log(err);
                return;
            }
            let dataCountry = dataJSON.filter(obj => {
                return obj.country === args[0];
            });
            if (dataCountry.length === 0) return message.reply(`Country code is invalid. For list of country codes, use \`\`${client.config.prefix}countrycodes\`\``);

            let embed = new Discord.MessageEmbed()
                .setTitle(`Coronavirus outbreak in ${args[0]}`)
                .setTimestamp(Date.now())
                .addField('Total cases', dataCountry[0].cases, true)
                .addField('Today\'s cases', dataCountry[0].todayCases, true)
                .addField('Recovered', dataCountry[0].recovered)
                .addField('Critical', dataCountry[0].critical)
                .addField('Deaths', dataCountry[0].deaths, true)
                .addField('Today\'s deaths', dataCountry[0].todayDeaths, true);
            message.channel.send(embed);
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
