import { setTaskAsComplete, setTaskAsIncomplete } from './Completed.js';

let jobs;

const listItem = () => jobs;

// function to set jobs to an array
const setjobs = (newjobs) => {
  jobs = newjobs;
};

const updateLocalStorage = () => {
  localStorage.setItem('jobs', JSON.stringify(jobs));
};

const AddToDoList = (input) => {
  if (input.value.trim().length === 0) return;
  jobs.push({
    description: input.value.trim(),
    completed: false,
    index: jobs.length + 1,
  });
  input.value = '';
  updateLocalStorage();
};

const removJob = (index) => {
  jobs = jobs.filter((task) => task.index !== index);

  // Update remaining task indices
  jobs.forEach((task, idx) => {
    task.index = idx + 1;
  });

  updateLocalStorage();
};

const updateTask = (task) => {
  jobs[task.index - 1].description = task.description;
  updateLocalStorage();
};

const resetToDoList = () => {
  const taskListItems = document.querySelectorAll('#todos > li');
  taskListItems.forEach((listItem, index) => {
    listItem.style.backgroundColor = '';

    const taskDescription = document.createElement('span');
    taskDescription.innerText = jobs[index].description;
    taskDescription.classList.add('task-description');
    if (jobs[index].completed) {
      taskDescription.style.textDecoration = 'line-through';
      taskDescription.style.color = '#e7dad2';
    }

    const checkBox = listItem.children[0];
    checkBox.classList.remove('checkbox-focused');

    const icon = listItem.children[2];
    icon.innerText = 'more_vert'; // Icon

    listItem.innerHTML = '';
    listItem.append(checkBox, taskDescription, icon);
  });
};

const showjobs = () => {
  const todoList = document.querySelector('#todos');
  todoList.innerHTML = '';
  jobs.forEach((task) => {
    const listItem = document.createElement('li');
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.checked = task.completed;

    const taskDescription = document.createElement('span');
    taskDescription.innerText = task.description;
    taskDescription.classList.add('task-description');
    if (task.completed) {
      taskDescription.style.textDecoration = 'line-through';
      taskDescription.style.color = '#a0a0a0';
      checkBox.checked = true;
    }

    const handle = document.createElement('span');
    handle.classList.add('material-symbols-outlined', 'md-30');
    handle.innerText = 'more_vert';

    checkBox.addEventListener('change', (e) => {
      if (e.target.checked) {
        taskDescription.style.textDecoration = 'line-through';
        taskDescription.style.color = '#a0a0a0';
        setTaskAsComplete(task);
      } else {
        taskDescription.style.textDecoration = '';
        taskDescription.style.color = '';
        setTaskAsIncomplete(task);
      }
      updateLocalStorage();
    });

    handle.addEventListener('click', () => {
      if (handle.innerText === 'delete') {
        removJob(task.index);
        showjobs();
        return;
      }

      resetToDoList();
      handle.innerText = 'delete';
      listItem.style.backgroundColor = '#feffdc';

      const editTaskInput = document.createElement('input');
      editTaskInput.value = task.description;
      editTaskInput.style.backgroundColor = '#feffdc';
      editTaskInput.classList.add('EditTodoList');

      // change checkbox BG color when edit task input is focused
      checkBox.classList.add('checkbox-focused');

      editTaskInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' && editTaskInput.value.trim().length > 0) {
          updateTask({
            ...task,
            description: editTaskInput.value.trim(),
          });

          taskDescription.innerText = task.description;
          // after editing a task - add checkbox, task description, and handle
          listItem.innerHTML = '';
          listItem.style.backgroundColor = '';
          listItem.append(checkBox, taskDescription, handle);
          resetToDoList();
        }
      });

      // to edit a task - add checkbox, edit task input, and handle
      listItem.innerHTML = '';
      listItem.append(checkBox, editTaskInput, handle);

      editTaskInput.focus();
    });

    // Initially - add checkbox, task description, and handle
    listItem.append(checkBox, taskDescription, handle);
    todoList.appendChild(listItem);
  });
};

export {
  listItem,
  setjobs,
  AddToDoList,
  showjobs,
  updateLocalStorage,
};
