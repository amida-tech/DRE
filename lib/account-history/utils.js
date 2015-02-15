var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
    event_type: {
        type: String,
        enum: ['initAccount', 'loggedIn', 'loggedOut', 'fileUploaded', 'fileDownloaded', 'labResults', 'passwordChange', 'infoUpdate'],
        required: true
    },
    userID: String,
    note: String,
    time: {
        type: Date,
        default: Date.now
    },
    fileRef: {
        type: String
    }
});

var Event = mongoose.model('Event', EventSchema);

module.exports.Event = Event;

var fullEventNames = {
    initAccount: 'Account created',
    loggedIn: 'Logged in',
    loggedOut: 'Logged out',
    fileUploaded: 'File uploaded',
    fileDownloaded: 'File downloaded', //could add filename or MHR
    labResults: 'Lab results received', //same as fileUploaded in API
    passwordChange: 'Password changed', //not in API yet
    infoUpdate: 'Profile updated' //not in API yet
};

exports.getFullEventName = function (typestring) {
    return fullEventNames[typestring];
}

//Used in login, storage, record
exports.saveEvent = function (eventType, username, note, file) {
    //record.saveEvent
    var newEvent = new Event({
        userID: username, //not necessary w/authentication?
        event_type: eventType,
        note: note, //file descriptor, IP address
        fileRef: file //MongoDB _id
    });
    newEvent.save(function (err) {
        if (err) {
            return err
        }
    });
};
