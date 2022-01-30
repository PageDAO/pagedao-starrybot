const db = require("../db")
const { createButton, createEmbed, createMessage } = require("../utils/messages");

///
/// Default roles (later we may not have any default roles)
///

const desiredRoles = [
	{
		name:'osmo-hodler',
		type:"native",
		address:"osmo",
		net:"mainnet",
	},
	{
		name:'juno-hodler',
		type:"native",
		address:"juno",
		net:"mainnet",
	}
];

// Display name for the roles in the welcome embed
const desiredRolesForMessage = desiredRoles.map(role => role.name).join('\n- ');

///
/// A helper to print the welcome message
///

function createWelcomeMessage(user, desiredRolesForMessage) {
	return createMessage({
		user,
		content: 'Hello friends, one more step please.\nSee the GIF below…',
		embeds: [
			createEmbed({
				title: `Enable secure slash commands`,
				description: `StarryBot just joined, and FYI there are some roles:\n- ${desiredRolesForMessage}`,
				imageUrl: `https://starrybot.xyz/starrybot-slash-commands2.gif`,
			})
		],
		components: [
			createButton({ label: `I just did it`})
		]
	});
}

///
/// When StarryBot joins a new guild, let's create any default roles and say hello
///

async function guildCreate(guild, client) {
	const systemChannelId = guild.systemChannelId;
	let systemChannel = await client.channels.fetch(systemChannelId);
	const welcomeMessage = createWelcomeMessage(client.user, desiredRolesForMessage);
	await systemChannel.send(welcomeMessage);
	let existingRoles =	await guild.roles.fetch();
	for(let i = 0;i<desiredRoles.length;i++) {
		let role = desiredRoles[i]
		// See if we can find an existing role with the same name.
		if(!existingRoles.find(existingRole => existingRole.name === role.name)) {
			await guild.roles.create({name: role.name, position: 0})
		}
		await db.rolesSet(guild.id,role.name,role.type,role.address,role.net,true,client.user.id,1);
	}
}

module.exports = {
    guildCreate,
}
