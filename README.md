#Basic API for saving account history events: 
First login, file uploaded, file downloaded, lab results, password change, personal info change

##Usage
```
#Manual testing using curl (brew install curl)
npm install
node server.js
```

List all events:

`
curl http://localhost:3005/accountEvents/all
`

Add new event (example):

```
 curl http://localhost:3005/accountEvents/add\?userID\=1\&event_type\=initAccount\&note\=no-note-here\&fileRef\=123

 event_type = ['initAccount', 'loggedIn', 'loggedOut', 'fileUploaded', 'fileDownloaded', 'labResults', 'passwordChange', 'infoUpdate']
```
