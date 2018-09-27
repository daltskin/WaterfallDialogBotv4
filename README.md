This sample shows how to concisely use the different built-in `botbuilder-dialogs` within a WaterfallDialog, ie. walking the user through a multi-step data entry process and persisting their choices throughout the process.

# To try this sample
- Clone this repository
- Install modules and start the bot
    ```bash
    npm i & npm start
    ```

# Testing the bot using Bot Framework Emulator
[Microsoft Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the Bot Framework emulator from [here](https://aka.ms/botframework-emulator)

## Connect to bot using Bot Framework Emulator V4
- Launch Bot Framework Emulator
- File -> Open Bot Configuration and navigate to SimpleWaterfallDialogBot.bot

# Running the bot - prompts
This sample uses the different prompt types that are provided within the [botbuilder-dialogs](https://github.com/Microsoft/botbuilder-js/tree/master/libraries/botbuilder-dialogs) library and supported by the SDK.

```
Bot: I am a bot that demonstrates a simple implmentation of the WaterfallDialog with multiple prompts using date type validation.
Bot: Who do you want to pay?
User: Jamie
Bot: How much do you want to pay Jamie?
User: 500
Bot: When do you want to pay Jamie 500?
User: Tomorrow
Bot: Which card would you like to pay with? [visa, amex, maestro]
User: amex
Bot: Are you sure you want to pay Jamie 500 on 2018-09-27 09:52:55 from your amex card?
User: Yes
Bot: Payment made
```

# Further reading
- [Prompt types](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-prompts?view=azure-bot-service-4.0&tabs=javascript)
- [Azure Bot Service Introduction](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)
- [Bot basics](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Channels and Bot Connector service](https://docs.microsoft.com/en-us/azure/bot-service/bot-concepts?view=azure-bot-service-4.0)
- [Activity processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)
