const { ComponentDialog, WaterfallDialog,TextPrompt} = require('botbuilder-dialogs');
const {leaveStatus, leaveStatusWF,textPromptDialogLS}=require('./constants/DialogIds');
const { confirmLeave} = require('../Cards/card');
const { CardFactory } = require('botbuilder');
class LeaveStatus extends ComponentDialog{
    constructor(){
        super(leaveStatus);
        this.addDialog(new WaterfallDialog(leaveStatusWF,[
            this.refNo.bind(this),
            this.showStatus.bind(this)
        ]));
        this.addDialog(new TextPrompt(textPromptDialogLS));
        this.initialDialogId=leaveStatusWF;
    }
    async refNo(stepContext){
        return await stepContext.prompt(textPromptDialogLS, `Enter the ref no which you got while applying the leave.`);
    }
    async showStatus(stepContext){
        console.log(stepContext.context.activity.text);
        var data=await this.database(stepContext);
        await stepContext.context.sendActivity({
            attachments: [CardFactory.adaptiveCard(confirmLeave(data.leaveType, data.noOfDays, data.date))]
        });

        return await stepContext.endDialog({name:"ankit"});
    }
    async database(stepContext){
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
        var filter={};
        filter._id=stepContext.context.activity.text;
        const data=await model.findOne(filter)
        return data;
    }
}
module.exports.LeaveStatus=LeaveStatus;