require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()
const { MessageEmbed } = require('discord.js')
const prefix = '$'
const { helpemsg, nogemsg, setupcemg, setupwmsg, setupremsg, setupfbremsg, notoemsg, notoftemsg, confoemsg } = require('./Embeds.json')
const dbots = require('dbots');
const poster = new dbots.Poster({
    client,
    apiKeys: {
        topgg: '',
        discordboats: '9aef970d0f17af17421792fa7075d3013b138e42ee56de2d331cb5f777a6c6f328fc90a6242cb19b1593fd7005aa5f5c0332c72339dd05dc2b114ab6284fb93b',
        Blist: 'Kjs0k-yVNKkXdkcf9_5t',
    },
    clientLibrary: 'discord.js'
});
 
poster.startInterval();

client.on('ready', () => {
    console.log("This bot is online!")

    setInterval(() => {
        const statuses = [
            `Waiting for tickets to tick`,
            `Ticking tickets`,
            `Tickety ticking`,
            `$help`,
            `watch the clock | ticking`,
            `some of Minecrafty999's greatest hits`,
        ]

        const status = statuses[Math.floor(Math.random() * statuses.length)]
        client.user.setActivity(status, { type: "PLAYING" })
    }, 50000)
})

client.on('message', async message => {
    const args = message.content.substring(prefix.length).split(" ")

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.channel.guild) return message.channel.send(nogemsg)
    if (message.guild.me.hasPermission("MANAGE_CHANNELS") && message.author.id === message.guild.owner.id && message.content.startsWith(`${prefix}setup`)) {
        await (message.guild.roles.create({
            name: "new role"
        }));
        const rorlr = message.guild.roles.cache.find(role => role.name === "new role")
        rorlr.edit({
            name: "🤝Support Team",
            color: "PURPLE"
        })
        message.guild.channels.create("Tickets", {
            type: "category"
        })
        const tchannel = "📔Ticker log"
        message.guild.channels.create(tchannel, { topic: "See what I'm doing in you server" }).then(c => {
            c.updateOverwrite(message.guild.owner, {
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true,
                SEND_MESSAGES: true
            })
            c.updateOverwrite(message.guild.me, {
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true,
                SEND_MESSAGES: true
            })
        })
        await (message.guild.roles.create({
            name: "new role"
        }))
        const rorl = message.guild.roles.cache.find(role => role.name === "new role")
        rorl.edit({
            name: "Ticket owner"
        })
        message.channel.send(setupcemg)
        message.channel.send(setupwmsg)
        message.channel.send(setupremsg)
        message.channel.send(setupfbremsg)

    } else if (message.author.id !== message.guild.owner.id && message.content.startsWith(`${prefix}setup`)) {

        message.guild.owner.send(new MessageEmbed()
            .setColor("RED")
            .setTitle('__**SETUP USED**__')
            .setDescription(`The setup command was used by ${message.author.username} on you server`)
            .setFooter( text = "Brought to you by Minecrafty999", iconURL = "https://cdn.discordapp.com/avatars/660862491102019604/5b28dadf6cf852c943e1df0a82dad850.webp" )
        )

        message.channel.send(notoemsg)
    } else if (message.content.startsWith(`${prefix}ticket ${args[1]}`)) {
        const supportrole = message.guild.roles.cache.find(role => role.name === "🤝Support Team")
        const ticketrole = message.guild.roles.cache.find(role => role.name === "Ticket owner")
        message.member.roles.add(ticketrole)
        const log = message.guild.channels.cache.find(channel => channel.name === "📔ticker-log")
        const channelName = `🎟️ticket-${message.author.username}-${message.author.discriminator}`
        const SupportCategory = message.guild.channels.cache.find(category => category.name === "Tickets")
        message.guild.channels.create(channelName, { parent: SupportCategory.id, topic: `Ticket Owner: ${message.author.username}` }).then(c => {
            c.updateOverwrite(supportrole, {
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true,
                SEND_MESSAGES: true
            })
            c.updateOverwrite(message.author, {
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true,
                SEND_MESSAGES: true
            })
            c.updateOverwrite(message.guild.me, {
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: false,
                SEND_MESSAGES: false
            })
            c.send(new MessageEmbed()
                .setColor("GREEN")
                .setTitle('**NEW TICKET**')
                .addFields(
                    { name: "Owner", value: `This is ${message.author.username}'s ticket` },
                    { name: "Reason", value: `${args[1]}` }
                )
                .setThumbnail(message.author.displayAvatarURL())
                .setTimestamp()
                .setFooter( text = "Brought to you by Minecrafty999", iconURL = "https://cdn.discordapp.com/avatars/660862491102019604/5b28dadf6cf852c943e1df0a82dad850.webp" )
            )
            log.send(new MessageEmbed()
                .setColor("GREEN")
                .setTitle('**NEW TICKET**')
                .addFields(
                    { name: "Owner", value: `The owner of the new ticket is ${message.author.username}` },
                    { name: "Reason", value: `${args[1]}` }
                )
                .setThumbnail(message.author.displayAvatarURL())
                .setTimestamp()
                .setFooter( text = "Brought to you by Minecrafty999", iconURL = "https://cdn.discordapp.com/avatars/660862491102019604/5b28dadf6cf852c943e1df0a82dad850.webp" )
            )
        }).catch(console.error);
    } else if (message.content.startsWith(`${prefix}close`) && message.member.roles.cache.find(role => role.name === "Ticket owner")) {
        message.channel.delete()
        const ticketrole = message.guild.roles.cache.find(role => role.name === "Ticket owner")
        message.member.roles.remove(ticketrole)
        const log = message.guild.channels.cache.find(channel => channel.name === "📔ticker-log")
        log.send(new MessageEmbed()
            .setColor("GREEN")
            .setTitle('**TICKET CLOSED**')
            .addFields(
                { name: "Owner", value: `This was ${message.author.username}'s ticket` }
            )
            .setThumbnail(message.author.displayAvatarURL())
            .setTimestamp()
            .setFooter("Brought to you by Minecrafty999")
        )
    } else if (message.content.startsWith(`${prefix}close`) && !message.member.roles.cache.find(role => role.name === "Ticket owner")) {
        const log = message.guild.channels.cache.find(channel => channel.name === "📔ticker-log")
        message.channel.send(notoftemsg)
        log.send(new MessageEmbed()
            .setColor("GREEN")
            .setTitle('**TICKET CLOSED**')
            .addFields(
                { name: "Some one tryed to close someones ticket", value: "There name is below" },
                { name: "User", value: `${message.author.username}` }
            )
            .setThumbnail(message.author.displayAvatarURL())
            .setTimestamp()
            .setFooter("Brought to you by Minecrafty999")
        )
    } else if (message.content.startsWith(`${prefix}help`)) {
        message.channel.send(helpemsg)
    } else if (message.content.startsWith(`${prefix}ticket`)) {
        message.channel.send(new MessageEmbed()
            .setColor("GREEN")
            .setTitle('**ERROR**')
            .setDescription(`Uesage: \`${prefix}ticket (reason here)\``)
        )
    } else if (message.content.startsWith(`${prefix}unsetup`) && message.author.id === message.guild.owner.id) {
        const hfd = await message.channel.send(confoemsg)

        await hfd.react('✅')
        await hfd.react('❌')

        const filter = (reaction, user) => {
            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id
        }

        hfd.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(reaction => {
                if (reaction.first().emoji.name === '✅') {
                    const tlog = message.guild.channels.cache.find(channel => channel.name === "📔ticker-log")
                    tlog.delete()

                    const ticketsca = message.guild.channels.cache.find(category => category.name === "Tickets")
                    ticketsca.delete()

                    const torole = message.guild.roles.cache.find(role => role.name === "Ticket owner")
                    torole.delete()

                    const srole = message.guild.roles.cache.find(role => role.name === "🤝Support Team")
                    srole.delete()

                    hfd.delete()

                    message.channel.send(new MessageEmbed()
                        .setColor("ORANGE")
                        .setTitle('**UNINSTALL**')
                        .setDescription("I have successfully uninstalled or unsetup my self on your server. You can now kick or ban me from the server. Good bye! :(")
                    )
                }

                if (reaction.first().emoji.name === '❌') {
                    hfd.delete()
                    message.channel.send(new MessageEmbed()
                        .setColor("RED")
                        .setTitle('**TERMANATING**')
                        .setDescription("Termanating command.....")
                    )
                }
            })
            .catch(() => {

                hfd.delete()

                return message.channel.send(new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle('**CANCELING**')
                    .setDescription("You ran out of time\nTermanating....")
                )
            })
    } else if (message.content.startsWith(`${prefix}unsetup`) && message.author.id !== message.guild.owner.id) {
        message.channel.send(new MessageEmbed()
            .setColor("GREEN")
            .setTitle('**ERROR**')
            .setDescription("You are not the owner of this server")
        )
    }
})

client.login(process.env.token)