#Basic API for saving account history events: 
Account creation, login, logout, file uploaded, file downloaded, lab results, password change, personal info change

##Usage
```
#Manual testing using curl (brew install curl)
npm install
node server.js
```

Add new event (example):

```
 curl -d 'userID=1' -d 'event_type=initAccount' -d 'note=no-note-here' -d 'fileRef=AAA' http://localhost:3005/account_history

 event_type = ['initAccount', 'loggedIn', 'loggedOut', 'fileUploaded', 'fileDownloaded', 'labResults', 'passwordChange', 'infoUpdate']
```
List all events:

`
curl http://localhost:3005/account_history/all
`
