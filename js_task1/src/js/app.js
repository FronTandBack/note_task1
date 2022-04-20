"use strict";

const categories = [
  {
    icon: `<i class="fa fa-shopping-cart" aria-hidden="true"></i>`,
    type: "Task",
  },
  {
    icon: `<i class="fa fa-android" aria-hidden="true"></i>`,
    type: "Random Thought",
  },
  {
    icon: `<i class="fa fa-lightbulb-o" aria-hidden="true"></i>`,
    type: "Idea",
  },
  {
    icon: `<i class="fa fa-quote-right" aria-hidden="true"></i>`,
    type: "Quote",
  },
];

let NOTES_LIST = [
  {
    id: 100,
    title: "Shopping list",
    created: new Date().toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    category: categories[0],
    content: "Tomatoes, bread",
    archive: false,
  },
  {
    id: 101,
    title: "Baz",
    created: new Date().toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    category: categories[2],
    content: "Liga Champions",
    archive: false,
  },
  {
    id: 102,
    title: "Foo",
    created: new Date().toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    category: categories[1],
    content: "Football, Real",
    archive: false,
  },
  {
    id: 103,
    title: "Doo",
    created: new Date().toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    category: categories[3],
    content: "Tomatoes, bread",
    archive: false,
  },
  {
    id: 104,
    title: "Shopping list",
    created: new Date().toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    category: categories[0],
    content: "Tomatoes, bread",
    archive: false,
  },
];

const createNoteBtnNode = document.querySelector(".create-note");
const addNoteBtnNode = document.getElementById("add-note-btn");
const editNoteBtnNode = document.getElementById("edit-note-btn");
const titleInput = document.getElementById("note-title-input");
const dateInput = document.getElementById("note-date-input");
const noteFormNode = document.querySelector(".note-form");
const noteListNode = document.querySelector(".note-list");
const summaryListNode = document.querySelector(".summary-notes-list");
const archiveBtNote = document.querySelector(".archived");
const select = document.getElementById("type-category");
const contentTextarea = document.getElementById("note-content");
let editEntryNote = undefined;

function init() {
  renderDefaultNotes(NOTES_LIST, noteListNode);
}

createNoteBtnNode.addEventListener("click", () => {
  toggle(noteFormNode);
  showElementInDOM(addNoteBtnNode, "inline-block");
  showElementInDOM(editNoteBtnNode, "none");
});

addNoteBtnNode.addEventListener("click", addNoteToUI);
noteListNode.addEventListener("click", deleteNoteFromUI);
noteListNode.addEventListener("click", editNoteInUI);
noteListNode.addEventListener("click", archiveNoteInUI);

editNoteBtnNode.addEventListener("click", () => {
  let category = categories[select.selectedIndex];
  if (!titleInput.value || !dateInput.value || !contentTextarea.value) return;

  editEntryNote.title = titleInput.value;
  editEntryNote.created = dateInput.value;
  editEntryNote.category = category;
  editEntryNote.content = truncate(contentTextarea.value, 40);

  const editEntryNoteNode = document.getElementById(editEntryNote.id);

  editEntryNoteNode.children[0].innerHTML = editEntryNote.category.icon;
  editEntryNoteNode.children[1].innerHTML = editEntryNote.title;
  editEntryNoteNode.children[2].innerHTML = editEntryNote.created;
  editEntryNoteNode.children[3].innerHTML = editEntryNote.category.type;
  editEntryNoteNode.children[4].innerHTML = editEntryNote.content;
});

archiveBtNote.addEventListener("click", () => {
  console.log(NOTES_LIST);

  NOTES_LIST.forEach((note) => {
    if (note.archive === true) {
      let elementArchive = document.getElementById(note.category.type);
      let html = noteTemplate(note);

      elementArchive.insertAdjacentHTML("afterend", html);
    }
  });
});

summaryListNode.addEventListener("click", archiveNoteInUI);

function checkElementExistsInDOM(element) {
  return typeof element != "undefined" && element != null ? true : false;
}

function showElementInDOM(elementNode, cssRule) {
  elementNode.style.display = cssRule;
}

function toggle(elementNode) {
  if (elementNode.style.display === "none" || elementNode.style.display === "") {
    elementNode.style.display = "flex";
  } else {
    elementNode.style.display = "none";
  }
}

function archiveNoteInUI(event) {
  const archiveBtn = event.target;

  if (archiveBtn.id === "archive-note") {
    const noteToArchive = archiveBtn.parentNode.parentNode;
    const containerArchive = archiveBtn.parentNode.parentNode.parentNode;
    const noteId = parseInt(noteToArchive.id);
    toggleArchivePropInArray(noteId);

    if (containerArchive.className === "summary-notes-list") {
      noteToArchive.remove();
      let noteUnarchive = noteListNode.children.namedItem(noteId);
      showElementInDOM(noteUnarchive, "flex");
    } else {
      showElementInDOM(noteToArchive, "none");
    }

    const summaryTable = {
      "Task": {
        icon: categories[0].icon,
        archive: 0,
        total: 0,
        active: 0,
      },
      "Random Thought": {
        icon: categories[1].icon,
        archive: 0,
        total: 0,
        active: 0,
      },
      "Idea": {
        icon: categories[2].icon,
        archive: 0,
        total: 0,
        active: 0,
      },
      "Quote": {
        icon: categories[3].icon,
        archive: 0,
        total: 0,
        active: 0,
      },
    };

    NOTES_LIST.forEach((note) => {
      switch (note.category.type) {
        case "Task":
          summaryTable["Task"].total++;
          summaryTable["Task"].archive = note.archive
            ? ++summaryTable["Task"].archive
            : summaryTable["Task"].archive;
          summaryTable["Task"].active = summaryTable["Task"].total - summaryTable["Task"].archive;
          break;
        case "Random Thought":
          summaryTable["Random Thought"].total++;
          summaryTable["Random Thought"].archive = note.archive
            ? ++summaryTable["Random Thought"].archive
            : summaryTable["Random Thought"].archive;
          summaryTable["Random Thought"].active =
            summaryTable["Random Thought"].total - summaryTable["Random Thought"].archive;

          break;
        case "Idea":
          summaryTable["Idea"].total++;
          summaryTable["Idea"].archive = note.archive
            ? ++summaryTable["Idea"].archive
            : summaryTable["Idea"].archive;
          summaryTable["Idea"].active = summaryTable["Idea"].total - summaryTable["Idea"].archive;
          break;
        case "Quote":
          summaryTable["Quote"].total++;
          summaryTable["Quote"].archive = note.archive
            ? ++summaryTable["Quote"].archive
            : summaryTable["Quote"].archive;
          summaryTable["Quote"].active =
            summaryTable["Quote"].total - summaryTable["Quote"].archive;
          break;
      }
    });

    let summaryHtml = ``;
    if (summaryListNode.childElementCount) summaryListNode.innerHTML = "";
    for (const item in summaryTable) {
      if (summaryTable[item].archive === 0) continue;
      summaryHtml += summaryInfoTemplate(summaryTable[item], item);
    }

    insertNoteToDOM(summaryHtml, summaryListNode);
  }
}

// console.dir(summaryListNode);

function summaryInfoTemplate(note, type) {
  return `<div class="notes-present todo-note todo-note--bg" id="${type}">
      <div class="icon">
        ${note.icon}
      </div>
      <div class="category">${type}</div>
      <div class="category-active">${note.active}</div>
      <div class="category-archived">${note.archive}</div>
    </div>`;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function toggleArchivePropInArray(noteId) {
  const foundNoteInArray = NOTES_LIST.find((note) => note.id === noteId);
  // let { archive } = foundNoteInArray;

  foundNoteInArray.archive = !foundNoteInArray.archive;
  // archive = archive ? false : true;
  // foundNoteInArray.archive = archive;
}

function addNoteToUI() {
  let category = categories[select.selectedIndex];

  if (!titleInput.value || !dateInput.value || !contentTextarea.value) return;

  const note = {
    title: titleInput.value,
    created: dateInput.value,
    category,
    content: truncate(contentTextarea.value, 40),
  };

  addNoteToArray(note);
  renderAddedNoteToUI(NOTES_LIST, noteListNode);
  clearInput([titleInput, dateInput]);
}

function deleteNoteFromUI(event) {
  const btnDelete = event.target;

  if (btnDelete.id === "delete-note") {
    const noteDelete = btnDelete.parentNode.parentNode;
    const noteId = parseInt(noteDelete.id);
    deleteNoteFromArray(noteId);
    noteDelete.remove();
  }
}

function editNoteInUI(event) {
  const editNote = event.target;

  if (editNote.id === "edit-note") {
    const noteForEdit = editNote.parentNode.parentNode;
    const noteId = parseInt(noteForEdit.id);
    const foundNoteInArray = NOTES_LIST.find((note) => note.id === noteId);
    titleInput.value = foundNoteInArray.title;
    dateInput.value = foundNoteInArray.created;
    contentTextarea.value = foundNoteInArray.content;
    editEntryNote = foundNoteInArray;
    showElementInDOM(noteFormNode, "flex");
    showElementInDOM(addNoteBtnNode, "none");
    showElementInDOM(editNoteBtnNode, "inline-block");
  }
}



function renderAddedNoteToUI(arrayOfElements, elementNode) {
  let templateHtml = ``;
  const lastNote = getLastItemFromArray(arrayOfElements);

  templateHtml += noteTemplate(lastNote);

  insertNoteToDOM(templateHtml, elementNode);
}

function renderDefaultNotes(arrayOfElements, elementNode) {
  let noteHtml = ``;
  arrayOfElements.forEach((note) => {
    noteHtml += noteTemplate(note);
  });

  insertNoteToDOM(noteHtml, elementNode);
}

function noteTemplate(note) {
  return `<div class="notes-present todo-note" id=${note.id}>
      <div class="icon">
        ${note.category.icon}
      </div>
      <div class="title">${note.title}</div>
      <div class="created">${note.created}</div>
      <div class="category">${note.category.type}</div>
      <div class="content">${note.content}</div>
      <div class="icons">
        <i id="edit-note" class="fa fa-pencil" aria-hidden="true"></i>
        <i id="archive-note" class="fa fa-arrow-circle-down" aria-hidden="true"></i>
        <i id="delete-note" class="fa fa-trash" aria-hidden="true"></i>
      </div>
    </div>`;
}

function addNoteToArray(note) {
  if (Array.isArray(NOTES_LIST) && !NOTES_LIST.length) {
    note.id = 0;
  } else {
    const lastNote = getLastItemFromArray(NOTES_LIST);
    note.id = lastNote.id + 1;
  }

  NOTES_LIST = [...NOTES_LIST, note];
}

function getLastItemFromArray(arr) {
  return arr[arr.length - 1];
}

function insertNoteToDOM(noteHtml, el) {
  el.insertAdjacentHTML("afterbegin", noteHtml);
}

function deleteNoteFromArray(id) {
  // STORAGE_IDS.splice(id, 1);
  NOTES_LIST = NOTES_LIST.filter((note) => note.id !== id);
}

function clearInput(inputs) {
  inputs.forEach((input) => {
    input.value = "";
  });
}

function truncate(str, n) {
  return str.length > n ? str.substr(0, n - 1) + "&hellip;" : str;
}

init();
