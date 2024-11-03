let taskCount = { "to do": 0, "in Progress": 0, "done": 0 };
let isEditing = false; 
let currentTaskElement = null; 

function openModal() {
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('taskForm').reset();
    isEditing = false;
    currentTaskElement = null;
}

document.getElementById('taskForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const taskName = document.getElementById('taskName').value;
    const description = document.getElementById('description').value;
    const status = document.getElementById('status').value;
    const date = document.getElementById('date').value;
    const priority = document.getElementById('priority').value;

    // Vérifier si la date est logique 
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
        alert("La date ne peut pas être intérieure à aujourd'hui.");
        return; 
    }

    let priorityColor = priority === "P1" ? "border-red-400" : priority === "P2" ? "border-orange-400" : "border-green-400";

    if (isEditing && currentTaskElement) {
        currentTaskElement.querySelector('.task-title').textContent = taskName;
        currentTaskElement.querySelector('.task-desc').textContent = description;
        currentTaskElement.querySelector('.task-date').textContent = `Date: ${date}`;
        currentTaskElement.querySelector('.task-priority').textContent = `Priority: ${priority}`;
        currentTaskElement.className = `bg-gray-800 p-4 rounded border-l-4 ${priorityColor} mb-4`;
        isEditing = false;
    } else {
        const newTask = document.createElement('div');
        newTask.setAttribute('draggable', 'true');
        newTask.setAttribute('ondragstart', 'drag(event)');
        newTask.classList.add('bg-gray-800', 'p-4', 'rounded', 'border-l-4', priorityColor, 'mb-4');
        newTask.innerHTML = `
            <h3 class="task-title font-bold mb-2">${taskName}</h3>
            <p class="task-desc text-sm text-gray-300 mb-2">${description}</p>
            <p class="task-date text-sm">Date: ${date}</p>
            <p class="task-priority text-sm">Priority: ${priority}</p>
            <div class="flex justify-between mt-2">
                <button class="text-red-500" onclick="deleteTask(this)">Delete</button>
                <button class="text-yellow-500" onclick="editTask(this)">Edit</button>
            </div>
        `;
        document.getElementById(status.replace(' ', '') + 'Section').appendChild(newTask);
        taskCount[status]++;
        updateTaskCount(status);
    }

    closeModal();
});

function deleteTask(button) {
    const task = button.parentElement.parentElement;
    const sectionId = task.parentElement.id;
    let status = "";

    if (sectionId === "todoSection") {
        status = "to do";
    } else if (sectionId === "inProgressSection") {
        status = "in Progress";
    } else {
        status = "done";
    }

    task.remove();
    taskCount[status]--;
    updateTaskCount(status);
}

function editTask(button) {
    isEditing = true;
    currentTaskElement = button.parentElement.parentElement;

    document.getElementById('taskName').value = currentTaskElement.querySelector('.task-title').textContent;
    document.getElementById('description').value = currentTaskElement.querySelector('.task-desc').textContent;
    document.getElementById('status').value = currentTaskElement.parentElement.id.replace('Section', '').replace(/([A-Z])/g, ' $1');
    document.getElementById('date').value = currentTaskElement.querySelector('.task-date').textContent.split(': ')[1];
    document.getElementById('priority').value = currentTaskElement.querySelector('.task-priority').textContent.split(': ')[1];
    
    openModal();
}

function updateTaskCount(status) {
    const section = document.getElementById(status.replace(' ', '') + 'Section');
    const title = section.querySelector('h2');
    title.textContent = `${title.textContent.split('|')[0]} | ${taskCount[status]}`;
}

function filterTasks(searchTerm) {
const tasks = document.querySelectorAll('.grid div[draggable="true"]');
tasks.forEach(task => {
    const title = task.querySelector('.task-title').textContent.toLowerCase();
    if (title.includes(searchTerm.toLowerCase())) {
        task.style.display = 'block';
    } else {
        task.style.display = 'none';
    }
});
}

function filterByPriority(priority) {
const tasks = document.querySelectorAll('.grid div[draggable="true"]');
tasks.forEach(task => {
    const taskPriority = task.querySelector('.task-priority').textContent.split(': ')[1];
    if (priority === '' || taskPriority === priority) {
        task.style.display = 'block';
    } else {
        task.style.display = 'none';
    }
});
}

function sortByDate(order) {
const sections = [document.getElementById('todoSection'), document.getElementById('inProgressSection'), document.getElementById('doneSection')];
sections.forEach(section => {
    const tasks = Array.from(section.querySelectorAll('div[draggable="true"]'));
    tasks.sort((a, b) => {
        const dateA = new Date(a.querySelector('.task-date').textContent.split(': ')[1]);
        const dateB = new Date(b.querySelector('.task-date').textContent.split(': ')[1]);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
    tasks.forEach(task => section.appendChild(task));
});
}