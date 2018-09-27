// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder');
const { TextPrompt, NumberPrompt, ChoicePrompt, ConfirmPrompt, DateTimePrompt, DialogSet, WaterfallDialog } = require('botbuilder-dialogs');

const DIALOG_STATE_PROPERTY = 'dialogState';
const PAYMENT_DIALOG = 'payment_dialog';

const NAME_PROMPT = 'name_prompt';
const NUMBER_PROMPT = 'number_prompt';
const DATE_PROMPT = 'date_prompt';
const CHOICE_PROMPT = 'choice_prompt';
const CONFIRM_PROMPT = 'confirm_prompt';

const USER_NAME_PROPERTY = "username";
const AMOUNT_PROPERTY = "amount";
const CARD_PROPERTY = "card";
const DATE_PROPERTY = "date";

class SimpleWaterfallDialogBot {
    /**
     *
     * @param {Object} conversationState
     * @param {Object} userState
     */
    constructor(conversationState, userState) {
        // creates a new state accessor property. see https://aka.ms/about-bot-state-accessors to learn more about the bot state and state accessors
        this.conversationState = conversationState;
        this.userState = userState;

        this.dialogState = this.conversationState.createProperty(DIALOG_STATE_PROPERTY);
        this.dialogs = new DialogSet(this.dialogState);

        // Add prompts
        this.dialogs.add(new TextPrompt(NAME_PROMPT));
        this.dialogs.add(new NumberPrompt(NUMBER_PROMPT));
        this.dialogs.add(new DateTimePrompt(DATE_PROMPT));
        this.dialogs.add(new ChoicePrompt(CHOICE_PROMPT));
        this.dialogs.add(new ConfirmPrompt(CONFIRM_PROMPT));

        // Create a dialog that asks the user for their name.
        this.dialogs.add(new WaterfallDialog(PAYMENT_DIALOG, [
            async function (step) {
                await step.prompt(NAME_PROMPT, `Who do you want to pay?`);
            },
            async function (step) {
                step.values[USER_NAME_PROPERTY] = step.result;
                await step.prompt(NUMBER_PROMPT, `How much do you want to pay ${step.values[USER_NAME_PROPERTY]}`);
            },
            async function (step) {
                step.values[AMOUNT_PROPERTY] = step.result;
                await step.prompt(DATE_PROMPT, `When do you want to pay ${step.values[USER_NAME_PROPERTY]} ${step.values[AMOUNT_PROPERTY]}?`);
            },
            async function (step) {
                step.values[DATE_PROPERTY] = step.result[0].value;
                await step.prompt(CHOICE_PROMPT, 'Which card would you like to pay with?', ['visa', 'amex', 'maestro']);
            },            
            async function (step) {
                step.values[CARD_PROPERTY] = step.result.value;
                await step.prompt(CONFIRM_PROMPT, `Are you sure you want to pay ${step.values[USER_NAME_PROPERTY]} ${step.values[AMOUNT_PROPERTY]} on ${step.values[DATE_PROPERTY]} from your ${step.values[CARD_PROPERTY]} card?`);
            },       
            async function (step) {
                if (step.result === true)
                {
                    await step.context.sendActivity("Payment made");
                }
                else
                {
                    await step.context.sendActivity("Cancelled payment");
                }
                await step.endDialog();
            },                              
        ]));
    }

    /**
     *
     * @param {Object} context on turn context object.
     */
    async onTurn(turnContext) {
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {
            // Create dialog context
            const dc = await this.dialogs.createContext(turnContext);

            const utterance = (turnContext.activity.text || '').trim().toLowerCase();
            if (utterance === 'cancel') {
                if (dc.activeDialog) {
                    await dc.cancelAllDialogs();
                    await dc.context.sendActivity(`Ok... Cancelled.`);
                } else {
                    await dc.context.sendActivity(`Nothing to cancel.`);
                }
            }

            // Continue the current dialog
            if (!turnContext.responded) {
                await dc.continueDialog();
            }

            // Show menu if no response sent
            if (!turnContext.responded) {
                await dc.beginDialog(PAYMENT_DIALOG);
            }
        } else if (
            turnContext.activity.type === ActivityTypes.ConversationUpdate
        ) {
            // Do we have any new members added to the conversation?
            if (turnContext.activity.membersAdded.length !== 0) {
                // Iterate over all new members added to the conversation
                for (var idx in turnContext.activity.membersAdded) {
                    // Greet anyone that was not the target (recipient) of this message.
                    // Since the bot is the recipient for events from the channel,
                    // context.activity.membersAdded === context.activity.recipient.Id indicates the
                    // bot was added to the conversation, and the opposite indicates this is a user.
                    if (turnContext.activity.membersAdded[idx].id !== turnContext.activity.recipient.id) {
                        // Send a "this is what the bot does" message to this user.
                        await turnContext.sendActivity('I am a bot that demonstrates a simple implmentation of the WaterfallDialog with multiple prompts using date type validation.');
                        
                        const dc = await this.dialogs.createContext(turnContext);
                        await dc.beginDialog(PAYMENT_DIALOG);
                    }
                }
            }
        }

        // Save changes to the user name.
        await this.userState.saveChanges(turnContext);

        // End this turn by saving changes to the conversation state.
        await this.conversationState.saveChanges(turnContext);
    }
}

module.exports.SimpleWaterfallDialogBot = SimpleWaterfallDialogBot;
