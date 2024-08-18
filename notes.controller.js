const fs = require("fs/promises");
const path = require("path");
const chalk = require("chalk");

const notesPath = path.join(__dirname, "db.json");

async function addNote(title) {
  const notes = await getNote();

  const note = {
    title,
    id: Date.now().toString(),
  };

  notes.push(note);

  await fs.writeFile("./db.json", JSON.stringify(notes));
  console.log(chalk.bgGreen("Note was added!"));
}

async function getNote() {
  const notes = await fs.readFile(notesPath, { encoding: "utf-8" });

  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

async function printNote() {
  const notes = await getNote();

  console.log(chalk.bgBlue("Here is the list of notes:"));
  notes.forEach(({ id, title }) => console.log(chalk.yellow(id, title)));
}

async function removeNote(id) {
  const notes = await getNote();
  const filteredNotes = notes.filter((note) => note.id !== id);

  if (notes.length === filteredNotes.length) {
    console.log(chalk.bgRed(`Note with id ${id} not found!`));
    return;
  }

  await fs.writeFile("./db.json", JSON.stringify(filteredNotes));
  console.log(chalk.bgGreen(`Note with id ${id} was removed!`));
}

async function editNote(id, newTitle) {
  const notes = await getNote();
  const noteIndex = notes.findIndex((note) => note.id === id);

  if (noteIndex === -1) {
    console.log(chalk.bgRed(`Note with id ${id} not found!`));
    return;
  }

  notes[noteIndex].title = newTitle;
  await fs.writeFile("./db.json", JSON.stringify(notes));
  console.log(chalk.bgGreen(`Note with id ${id} was updated!`));
}

module.exports = {
  addNote,
  printNote,
  removeNote,
  editNote,
};
