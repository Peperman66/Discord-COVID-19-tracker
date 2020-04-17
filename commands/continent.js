const Discord = require('discord.js');
const https = require('https');

module.exports.run = async (client, message, args) => {
    if (args.length < 1) return message.reply(`Usage: \`\`${client.config.prefix}continent <continent>\`\``);
    let continentString = encodeURIComponent(args.join(" "));

    let tempMessage = await message.channel.send('Requesting data...');

    https.get(`https://corona.lmao.ninja/v2/continents/${continentString}`, {}, res => {
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
            if (res.statusCode == 404) return tempMessage.edit(`Can't find specified continent. Maybe that continent has no recorded cases?`);
            if (res.statusCode != 200) return tempMessage.edit('Something went wrong. Please try again later.');
            let embed = new Discord.MessageEmbed()
                .setTitle(`Coronavirus outbreak in ${dataJSON.continent}`)
                .addField('Total cases', dataJSON.cases, true)
                .addField('Today\'s cases', dataJSON.todayCases, true)
                .addField('Recovered', dataJSON.recovered)
                .addField('Critical', dataJSON.critical)
                .addField('Active', dataJSON.active)
                .addField('Deaths', dataJSON.deaths, true)
                .addField('Today\'s deaths', dataJSON.todayDeaths, true)
                .setFooter('Last updated')
                .setTimestamp(dataJSON.updated);
            message.channel.send(embed);
            tempMessage.delete({ timeout: 5000 });
        });

        res.on('error', (err) => {
            console.log(err);
            tempMessage.edit('Something went wrong. Please try again later.');
        });
    });
}

module.exports.info = {
    name: "continent"
}
