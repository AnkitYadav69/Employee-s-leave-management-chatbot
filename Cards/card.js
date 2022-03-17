module.exports={
    loginForm:()=>{
        const loginForm={
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.2",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "Image",
                            "url": "https://celebaltech.com/assets/img/celebal.webp",
                            "size": "Large",
                            "altText": "CELEBAL TECHNOLOGIES"
                        },
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "Image",
                                            "url": "https://www.freeiconspng.com/thumbs/login-icon/user-login-icon-14.png",
                                            "size": "Small",
                                            "separator": true,
                                            "backgroundColor": "r"
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": " Please Login",
                                            "wrap": true,
                                            "size": "ExtraLarge",
                                            "spacing": "Medium",
                                            "horizontalAlignment": "Center",
                                            "height": "stretch",
                                            "fontType": "Default",
                                            "weight": "Bolder",
                                            "color": "Accent"
                                        }
                                    ]
                                }
                            ],
                            "spacing": "None",
                            "bleed": true
                        }
                    ]
                },
                {
                    "type": "TextBlock",
                    "text": "EMAIL:",
                    "wrap": true,
                    "fontType": "Monospace",
                    "style": "heading",
                    "weight": "Bolder",
                    "color": "Accent",
                    "size": "ExtraLarge"
                },
                {
                    "type": "Input.Text",
                    "placeholder": "Please enter your email here.",
                    "id": "email",
                    "style": "Email"
                },
                {
                    "type": "TextBlock",
                    "text": "Password:",
                    "wrap": true,
                    "style": "heading",
                    "color": "Accent",
                    "fontType": "Monospace",
                    "weight": "Bolder",
                    "size": "ExtraLarge"
                },
                {
                    "type": "Input.Text",
                    "id": "password",
                    "placeholder": "Please Enter your password here."
                },
                {
                    "type": "ActionSet",
                    "actions": [
                        {
                            "type": "Action.Submit",
                            "title": "LOGIN",
                            "id": "loginAction",
                            "style": "positive",
                            "data":{
                                "actionType":"Login"
                            }
                        },
                        {
                            "type": "Action.Submit",
                            "title": "CANCEL LOGIN",
                            "id": "cancelLogin",
                            "style": "positive",
                            "data":{
                                "actionType":"cancelLogin"
                            }
                        }
                    ]
                }
            ]
        }
        return loginForm;
    },
    confirmLeave:(leaveType,leaveDays,leaveDate)=>{
        return {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.2",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "Image",
                                            "url": "https://celebaltech.com/assets/img/celebal.webp",
                                            "size": "Medium"
                                        }
                                    ],
                                    "verticalContentAlignment": "Center",
                                    "backgroundImage": {
                                        "horizontalAlignment": "Center",
                                        "verticalAlignment": "Center"
                                    }
                                },
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Leave Application",
                                            "wrap": true,
                                            "size": "Medium",
                                            "weight": "Bolder",
                                            "color": "Accent",
                                            "horizontalAlignment": "Center"
                                        }
                                    ],
                                    "backgroundImage": {
                                        "horizontalAlignment": "Center",
                                        "verticalAlignment": "Center"
                                    }
                                }
                            ],
                            "horizontalAlignment": "Left"
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "separator": true,
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Type of Leave",
                                    "wrap": true,
                                    "horizontalAlignment": "Center"
                                }
                            ],
                            "horizontalAlignment": "Right"
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": `${leaveType}`,
                                    "wrap": true
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "separator": true,
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "backgroundImage": {
                                "horizontalAlignment": "Right"
                            },
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Number of Days",
                                    "wrap": true,
                                    "horizontalAlignment": "Center"
                                }
                            ],
                            "horizontalAlignment": "Right"
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": `${leaveDays}`,
                                    "wrap": true
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "separator": true,
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Leave Date",
                                    "wrap": true,
                                    "horizontalAlignment": "Center"
                                }
                            ],
                            "horizontalAlignment": "Right"
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": `${leaveDate}`,
                                    "wrap": true
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "TextBlock",
                    "text": "I have applied for the leave Application with above details and to know the status type \"leave status\".",
                    "wrap": true,
                    "size": "Default",
                    "weight": "Bolder",
                    "color": "Dark"
                }
            ]
        }
    },
    leaveApplicationForm:()=>{
        let leaveForm={
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.2",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "Image",
                                            "url": "https://celebaltech.com/assets/img/celebal.webp",
                                            "size": "Medium"
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Leave Application",
                                            "wrap": true,
                                            "weight": "Bolder",
                                            "horizontalAlignment": "Center"
                                        }
                                    ],
                                    "horizontalAlignment": "Center",
                                    "verticalContentAlignment": "Center",
                                    "backgroundImage": {
                                        "horizontalAlignment": "Right"
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "TextBlock",
                    "text": "Please select leave type:",
                    "wrap": true,
                    "weight": "Bolder",
                    "separator": true
                },
                {
                    "type": "Input.ChoiceSet",
                    "choices": [
                        {
                            "title": "Sick Leave",
                            "value": "sl"
                        },
                        {
                            "title": "Earned Leave",
                            "value": "el"
                        },
                        {
                            "title": "Casual Leave",
                            "value": "cl"
                        }
                    ],
                    "placeholder": "---Select---",
                    "id": "leaveType"
                },
                {
                    "type": "TextBlock",
                    "wrap": true,
                    "text": "Please enter number of days:",
                    "weight": "Bolder"
                },
                {
                    "type": "Input.Number",
                    "id": "noDays",
                    "placeholder": "Enter number of days",
                    "min": 1,
                    "max": 3,
                    "value": 1
                },
                {
                    "type": "TextBlock",
                    "text": "Please select the date on which you want to apply the leave:",
                    "wrap": true,
                    "weight": "Bolder"
                },
                {
                    "type": "Input.Date",
                    "id": "leaveDate",
                    "spacing": "None"
                },
                {
                    "type": "ActionSet",
                    "id": "leaveApplyApplication",
                    "horizontalAlignment": "Left",
                    "actions": [
                        {
                            "type": "Action.Submit",
                            "id": "applyLeave",
                            "title": "Apply",
                            "data":{
                                "actiontype":"applyLeaveAction"
                            }
                        },
                        {
                            "type": "Action.Submit",
                            "title": "Cancel",
                            "id": "cancelLeaveApplication"
                        }
                    ]
                }
            ]
        }
        return leaveForm;
    }
}