const { ComponentDialog, WaterfallDialog, ChoicePrompt, ChoiceFactory, NumberPrompt, TextPrompt, Dialog } = require('botbuilder-dialogs');
const { applyLeaveDialog, applyLeaveDialogWF1, choicePromptDialog, numberPromptDialog, textPromptDialog, applyLeaveDialogwithformWF, email } = require('./constants/DialogIds');
const { CardFactory } = require('botbuilder');
const { confirmLeave, loginForm } = require('../Cards/card');
const { leaveApplicationForm } = require('../Cards/card')
const validator = require("email-validator");
const bcrypt = require('bcrypt');


//mailing info's
const sgmail = require('@sendgrid/mail');
const path = require('path');
const dotenv = require('dotenv');


class ApplyLeaveDialog extends ComponentDialog {
    constructor(conversationstate) {
        super(applyLeaveDialog);
        if (!conversationstate) throw new Error('Conversation State Required');
        this.conversationstate = conversationstate;
        this.applyLeaveStateAccessor = this.conversationstate.createProperty('applyLeaveStatus');
        this.addDialog(new ChoicePrompt(choicePromptDialog));
        this.addDialog(new NumberPrompt(numberPromptDialog));
        this.addDialog(new TextPrompt(textPromptDialog));

        this.addDialog(new WaterfallDialog(applyLeaveDialogWF1, [
            this.askLeaveType.bind(this),
            this.askNumberOfDays.bind(this),
            this.askLeaveDate.bind(this),
            this.applyApplication.bind(this)
        ]));

        this.addDialog(new WaterfallDialog(applyLeaveDialogwithformWF, [
            this.showLoginForm.bind(this),
            this.showForm.bind(this),
            this.preProcessUserInput.bind(this),
            this.applyApplication.bind(this)
        ]))
        this.initialDialogId = applyLeaveDialogwithformWF;
    }

    //--------------userInput through Adaptive Card--------------
    async showLoginForm(stepContext) {
        await stepContext.context.sendActivity({
            attachments: [CardFactory.adaptiveCard(loginForm())]
        });
        return Dialog.EndOfTurn
    }

    async showForm(stepContext) {
        try {
            console.log("if", stepContext.context.activity.value);
            var db = await this.dbData(stepContext);
            console.log(db);
            if (!db) {
                stepContext.context.sendActivity("Invalid email id or password");
                return await stepContext.replaceDialog(applyLeaveDialogwithformWF);

            }
            let dailogData = await this.applyLeaveStateAccessor.get(stepContext.context, {});
            dailogData.email = stepContext.context.activity.value.email;
            await stepContext.context.sendActivity({
                attachments: [CardFactory.adaptiveCard(leaveApplicationForm())]
            });
            return Dialog.EndOfTurn;

        } catch (err) {
            await stepContext.context.sendActivity("error occured", err);
            console.log(err);
        }
    }

    async preProcessUserInput(stepContext) {
        try {
            console.log("Step=>", stepContext.context.activity.value);
            let userInput;
            let dailogData = await this.applyLeaveStateAccessor.get(stepContext.context, {});
            console.log(dailogData.email);
            userInput = stepContext.context.activity.value;
            if (userInput.leaveDate && userInput.noDays && userInput.leaveType) {
               dailogData.id= await this.savetodb(userInput, dailogData.email);
            }
            dailogData.leaveType = userInput.leaveType;
            dailogData.leaveDays = userInput.noDays;
            dailogData.date = userInput.leaveDate;

            if (dailogData.leaveDays > 3) {
                await stepContext.context.sendActivity("you can only apply for 3 days of leave please enter the details once again");
                return stepContext.endDialog();
            }
            else {
                stepContext.context.sendActivity("Thank you i have all the info all i need.please wait i apply your leave application");
                return stepContext.next();
            }

        } catch (err) {
            await stepContext.context.sendActivity("error occured", err);
            console.log(err);
        }
    }



    //--------------userInput through Adaptive Card--------------
    async askLeaveType(stepContext) {
        return await stepContext.prompt(choicePromptDialog, {
            prompt: 'Please help me with the with the type of leave you Want',
            choices: ChoiceFactory.toChoices(['Sick Leave', 'Casual Leave', 'Earned Leave'])
        });
    }
    async askNumberOfDays(stepContext) {
        let dailogData = await this.applyLeaveStateAccessor.get(stepContext.context, {});
        dailogData.leaveType = stepContext.result.value;
        return await stepContext.prompt(numberPromptDialog, `For how many days you want to apply ${dailogData.leaveType} for`);
    }
    async askLeaveDate(stepContext) {
        let dailogData = await this.applyLeaveStateAccessor.get(stepContext.context);
        dailogData.leaveDays = stepContext.result;
        return await stepContext.prompt(textPromptDialog, `For which date i should apply this ${dailogData.leaveType} application.`);
    }
    async applyApplication(stepContext) {
        let dailogData = await this.applyLeaveStateAccessor.get(stepContext.context);
        if (stepContext.result && !dailogData.leaveDate) {
            dailogData.leaveDate = stepContext.result;
        }
        await stepContext.context.sendActivity({
            attachments: [CardFactory.adaptiveCard(confirmLeave(dailogData.leaveType, dailogData.leaveDays, dailogData.date))]
        });

        await this.sendMail(stepContext);
        await stepContext.context.sendActivity(`Confirmation mail has been Sended to email id.Please Remember your unique Id to check status id=${dailogData.id}. Thank you`);
        return await stepContext.endDialog({ name: "ankit" });
    }

    async sendMail(stepContext) {
        const ENV_FILE = path.join(__dirname, '.env');
        dotenv.config({ path: ENV_FILE });
        sgmail.setApiKey(process.env.sendgridapikey);
        const msg = await this.makeMessage(stepContext);
        await sgmail.send(msg, (err, info) => {
            if (err)
                console.log(" Email not send error=>", err);
            else
                console.log('Email sended');

        })
    }
    async makeMessage(stepContext) {
        let dailogData = await this.applyLeaveStateAccessor.get(stepContext.context);
        const msg = {
            to: dailogData.email,
            from: {
                name: "Ankit Yadav",
                email: "ankit7001741051@gmail.com"
            },
            subject: "Leave confirmation",
            text: `You leave for ${dailogData.leaveType} of ${dailogData.leaveDays} Starting from ${dailogData.date} has been approved successfully`
        };
        return msg;
    }
    //database Functions
    async dbData(stepContext) {
        const mongoose = require('mongoose');
        var url = "mongodb://localhost:27017/project";
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

        var db = mongoose.connection;

        const User = mongoose.model('details', {
            email: { type: String },
            password: { type: String }
        });
        const filter = {};
        filter.email = stepContext.context.activity.value.email;
        const getuser = await User.findOne(filter);
        console.log("getuser=>", getuser);

        if (getuser) {
            var result = bcrypt.compareSync(stepContext.context.activity.value.password, getuser.password);
            if (result)
                return true;
            else
                return false;
        }
        else
            return false;
    }
    async savetodb(userInput, emailid) {
        const mongoose = require('mongoose');
        var url = "mongodb://localhost:27017/project";
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        var db = mongoose.connection;

        const model = mongoose.model('holiday', {
            email: { type: String },
            leaveType: { type: String },
            noOfDays: { type: String },
            date: { type: String }
        });
        var { leaveDate } = userInput;

        var user = new model({ email: emailid, leaveType: userInput.leaveType, noOfDays: userInput.noDays, date: leaveDate })
        user.save();
        return user._id;
    }
}
module.exports.ApplyLeaveDialog = ApplyLeaveDialog;