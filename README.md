#Usage

List all events:

`
curl http://localhost:3005/accountEvents
`

Add new event

`
curl http://localhost:3005/accountEvent\?id\=1\&event_type\=initAccount\&note\=no-note-here\&fileRef\=123
`

to install curl:

`
brew install curl
`