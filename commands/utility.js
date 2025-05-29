const request = require('request');

class UtilityCommands {
    // Utility function to add rare response to any message
    static addRareResponse(message, config) {
        if (Math.random() < 0.01 && config && config.rareResponse) {
            return message + `\n${config.rareResponse}`;
        }
        return message;
    }

    // Enhanced reply function that includes rare response logic
    static replyWithRareResponse(msg, message, config) {
        const finalMessage = this.addRareResponse(message, config);
        msg.reply(finalMessage);
    }    static handlePingCommand(msg, config) {
        UtilityCommands.replyWithRareResponse(msg, 'Pong!', config);
    }

    static handleEightBallCommand(msg, config) {
        const responses = [
            'No!',
            'Outlook not so good!',
            'Ask again later!',
            'You may rely on it!',
            'YES!'
        ];
        
        const randomIndex = Math.floor(Math.random() * responses.length);
        UtilityCommands.replyWithRareResponse(msg, responses[randomIndex], config);
    }    static handleRollCommand(msg, config) {
        // accept a roll command like !ROLL and number of sides, e.g., !ROLL 6
        const rollCommand = msg.content.split(' ')[1];
        const sides = parseInt(rollCommand, 10); 
        if (isNaN(sides) || sides <= 0) {
            UtilityCommands.replyWithRareResponse(msg, "Please provide a valid number of sides for the roll.", config);
            return;
        } else {
            const rollResult = Math.floor(Math.random() * sides) + 1;
            UtilityCommands.replyWithRareResponse(msg, `You rolled a ${rollResult} on a ${sides}-sided die!`, config);
        }  
    }    static handleCatFactCommand(msg, config) {
        request.get("https://catfact.ninja/fact", (error, response, body) => {
            if (error) {
                console.error('Cat fact API error:', error);
                UtilityCommands.replyWithRareResponse(msg, "Sorry, couldn't fetch a cat fact right now.", config);
            } else {
                try {
                    const catFact = JSON.parse(response.body);
                    UtilityCommands.replyWithRareResponse(msg, `Did you know: ${catFact.fact}`, config);
                } catch (parseError) {
                    console.error('Error parsing cat fact response:', parseError);
                    UtilityCommands.replyWithRareResponse(msg, "Sorry, couldn't fetch a cat fact right now.", config);
                }
            }
        });
    }    static handleHelpCommand(msg, config) {
        const helpMessage = `\`\`\`
+++ Welcome To Help +++

Available commands:
• !FOOD <food name> - Get nutrition information for a food item
• !EXER <exercise|gender|weight(kg)|height(cm)|age> - Calculate calories burned
• !YELP <city, state> - Find a random restaurant near you
• !BAR <city, state> - Find a random bar near you  
• !CBAR <city, state> - Find a cheap bar near you
• !WEATHER <location> - Get current weather information for a location
• !QUOTE - Get a random inspirational quote (posts to #quotes channel)
• !URBAN <term> - Get Urban Dictionary definition for a term
• !URBANRANDOM - Get a random Urban Dictionary definition
• !CATFACT - Get a random cat fact
• !8BALL <question> - Get a magic 8-ball response
• !PING - Test bot responsiveness
• !ROLL - Roll a die with a specified number of sides (e.g., !ROLL 6)
• !HELP - Show this help message
\`\`\``;
        
        UtilityCommands.replyWithRareResponse(msg, helpMessage, config);
    }

    static handleWeatherCommand(msg, config) {
        const location = msg.content.substring(9).trim(); // Remove "!WEATHER " from the command
          if (!location) {
            return UtilityCommands.replyWithRareResponse(msg, "Please provide a location. Example: !WEATHER New York", config);
        }

        const weatherUrl = `${config.WeatherAPIURL}?key=${config.WeatherAPIKey}&q=${encodeURIComponent(location)}&aqi=no`;

        request.get(weatherUrl, (error, response, body) => {
            if (error) {
                console.error('Weather API error:', error);
                UtilityCommands.replyWithRareResponse(msg, "Sorry, couldn't fetch weather information right now.", config);
            } else {
                try {
                    const weatherData = JSON.parse(body);
                    
                    if (weatherData.error) {
                        UtilityCommands.replyWithRareResponse(msg, `Weather error: ${weatherData.error.message}`, config);
                        return;
                    }

                    const current = weatherData.current;
                    const location = weatherData.location;
                    
                    const weatherMessage = `🌤️ **Current Weather for ${location.name}, ${location.region}, ${location.country}**\n` +
                        `🌡️ **Temperature:** ${current.temp_c}°C (${current.temp_f}°F)\n` +
                        `☁️ **Condition:** ${current.condition.text}\n` +
                        `💨 **Wind:** ${current.wind_kph} km/h (${current.wind_mph} mph) ${current.wind_dir}\n` +
                        `💧 **Humidity:** ${current.humidity}%\n` +
                        `👁️ **Visibility:** ${current.vis_km} km (${current.vis_miles} miles)\n` +
                        `🕒 **Local Time:** ${location.localtime}`;
                    
                    UtilityCommands.replyWithRareResponse(msg, weatherMessage, config);                } catch (parseError) {
                    console.error('Error parsing weather response:', parseError);
                    UtilityCommands.replyWithRareResponse(msg, "Sorry, couldn't parse weather information.", config);
                }
            }
        });
    }    static handleTheListCommand(msg, config) {
        // Try to find the quotes channel
        const quotesChannel = msg.guild.channels.cache.find(channel => 
            channel.name === 'the-list' && channel.type === 'text'
        );
        
        if (!quotesChannel) {
            return UtilityCommands.replyWithRareResponse(msg, "No the-list channel found! Please create a #quotes channel first.", config);
        }

        // Fetch messages from the quotes channel
        quotesChannel.messages.fetch({ limit: 100 })
            .then(messages => {
                // Filter out bot messages and empty messages
                const userMessages = messages.filter(message => 
                    !message.author.bot && message.content.trim().length > 0
                );
                
                if (userMessages.size === 0) {
                    return UtilityCommands.replyWithRareResponse(msg, "No quotes found in the #quotes channel! Add some messages there first.", config);
                }
                
                // Get a random message
                const randomMessage = userMessages.random();
                
                // Format and send the quote
                const quoteMessage = `💭 **Random Slur from #the-list**\n\n"${randomMessage.content}"\n\n*— ${randomMessage.author.username}* (${randomMessage.createdAt.toDateString()})`;
                
                UtilityCommands.replyWithRareResponse(msg, quoteMessage, config);
            })
            .catch(error => {
                console.error('Error fetching messages from quotes channel:', error);
                UtilityCommands.replyWithRareResponse(msg, "Sorry, couldn't fetch quotes from the channel right now.", config);
            });
    }    static handleQuoteCommand(msg, config) {
        // Try to find the quotes channel
        const quotesChannel = msg.guild.channels.cache.find(channel => 
            channel.name === 'quotes' && channel.type === 'text'
        );
        
        if (!quotesChannel) {
            return UtilityCommands.replyWithRareResponse(msg, "No quotes channel found! Please create a #quotes channel first.", config);
        }

        // Fetch messages from the quotes channel
        quotesChannel.messages.fetch({ limit: 100 })
            .then(messages => {
                // Filter out bot messages and empty messages
                const userMessages = messages.filter(message => 
                    !message.author.bot && message.content.trim().length > 0
                );
                
                if (userMessages.size === 0) {
                    return UtilityCommands.replyWithRareResponse(msg, "No quotes found in the #quotes channel! Add some messages there first.", config);
                }
                
                // Get a random message
                const randomMessage = userMessages.random();
                
                // Format and send the quote
                const quoteMessage = `💭 **Random Quote from #Quotes**\n\n"${randomMessage.content}"\n\n*— ${randomMessage.author.username}* (${randomMessage.createdAt.toDateString()})`;
                
                UtilityCommands.replyWithRareResponse(msg, quoteMessage, config);
            })
            .catch(error => {
                console.error('Error fetching messages from quotes channel:', error);
                UtilityCommands.replyWithRareResponse(msg, "Sorry, couldn't fetch quotes from the channel right now.", config);
            });
    }static handleUrbanCommand(msg, config) {
        const term = msg.content.substring(7).trim(); // Remove "!URBAN " from command
        
        let apiUrl;        if (term) {
            apiUrl = `https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`;
        } else {
            return UtilityCommands.replyWithRareResponse(msg, "Please provide a term to look up. Example: !URBAN javascript", config);
        }
        
        request.get(apiUrl, (error, response, body) => {
            if (error) {
                console.error('Urban Dictionary API error:', error);
                UtilityCommands.replyWithRareResponse(msg, "Sorry, couldn't fetch definition right now.", config);
                return;
            }
            
            try {
                const data = JSON.parse(body);
                if (data.list && data.list.length > 0) {
                    const definition = data.list[0];
                    
                    // Clean up and truncate long definitions
                    let def = definition.definition.replace(/\[|\]/g, ''); // Remove brackets
                    if (def.length > 400) {
                        def = def.substring(0, 400) + "...";
                    }
                    
                    let example = definition.example ? definition.example.replace(/\[|\]/g, '') : 'No example provided';
                    if (example.length > 200) {
                        example = example.substring(0, 200) + "...";
                    }
                    
                    const urbanMessage = `📚 **${definition.word}**\n\n` +
                        `**Definition:** ${def}\n\n` +
                        `**Example:** ${example}\n\n`;
                    
                    UtilityCommands.replyWithRareResponse(msg, urbanMessage, config);
                } else {
                    UtilityCommands.replyWithRareResponse(msg, `No definition found for "${term}". Try a different term or check your spelling.`, config);
                }
            } catch (parseError) {
                console.error('Error parsing Urban Dictionary response:', parseError);
                UtilityCommands.replyWithRareResponse(msg, "Sorry, couldn't parse the definition.", config);
            }
        });
    }    static handleUrbanRandomCommand(msg, config) {
        const apiUrl = 'https://api.urbandictionary.com/v0/random';
          request.get(apiUrl, (error, response, body) => {
            if (error) {
                console.error('Urban Dictionary API error:', error);
                UtilityCommands.replyWithRareResponse(msg, "Sorry, couldn't fetch a random definition right now.", config);
                return;
            }
            
            try {
                const data = JSON.parse(body);
                if (data.list && data.list.length > 0) {
                    const definition = data.list[0];
                    
                    // Clean up and truncate long definitions
                    let def = definition.definition.replace(/\[|\]/g, ''); // Remove brackets
                    if (def.length > 400) {
                        def = def.substring(0, 400) + "...";
                    }
                    
                    let example = definition.example ? definition.example.replace(/\[|\]/g, '') : 'No example provided';
                    if (example.length > 200) {
                        example = example.substring(0, 200) + "...";
                    }
                    
                    const urbanMessage = `🎲 **Random Urban Dictionary Definition**\n\n` +
                        `📚 **${definition.word}**\n\n` +
                        `**Definition:** ${def}\n\n` +
                        `**Example:** ${example}\n\n`; 

                    UtilityCommands.replyWithRareResponse(msg, urbanMessage, config);
                } else {
                    UtilityCommands.replyWithRareResponse(msg, "Couldn't fetch a random definition right now. Try again later.", config);
                }
            } catch (parseError) {
                console.error('Error parsing Urban Dictionary response:', parseError);
                UtilityCommands.replyWithRareResponse(msg, "Sorry, couldn't parse the definition.", config);
            }
        });
    }
}

module.exports = UtilityCommands;
