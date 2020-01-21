const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()).use(cors());

const LISTEN_PORT = 5000;

app.get('/notes', getRecepts);
app.post('/notes', postRecept);
app.put('/notes', putRecept);
app.delete('/notes', deleteRecept);

app.listen(LISTEN_PORT, () => {
  console.log(`Example app listening on port ${LISTEN_PORT}!`);
});

let notesMap = {
  1: {
    id: 1,
    title: 'blah',
    text: 'blah-blah',
    createdAt: '2019-01-21:18:23'
  },
  2: {
    id: 2,
    title: 'hello',
    text: 'world',
    createdAt: '2019-01-21:18:25',
  }
};

function getRecepts(req, res) {
  const notes = [];
  for(let key in notesMap) {
    notes.push(notesMap[key]);
  }
  res.send(JSON.stringify(notes))
}

function postRecept(req, res) {
  const newNote = req.body;
  if (!newNote || !newNote.id) {
    res.status(400).send();
  } else if (newNote.id in notesMap) {
    res.status(409).send();
  } else {
    notesMap[newNote.id] = newNote;
    res.send();
  }
}

function putRecept(req, res) {
  const newNote = req.body;
  if (!newNote || !newNote.id) {
    res.status(400).send();
  } else if (!(newNote.id in notesMap)) {
    res.status(404).send();
  } else {
    notesMap[newNote.id] = newNote;
    res.send();
  }
}

function deleteRecept(req, res) {
  const id = req.query.id;
  if (!id || !notesMap[id]) {
    res.status(404).send('Cannot delete note!');
  } else {
    delete notesMap[id];
    res.send();
  }
}
