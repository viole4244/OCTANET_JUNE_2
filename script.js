document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const categoryInput = document.getElementById('category-input');
    const dueDateInput = document.getElementById('due-date-input');
    const dueTimeInput = document.getElementById('due-time-input');
    const priorityInput = document.getElementById('priority-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const toggleModeBtn = document.getElementById('toggle-mode-btn');
    const filterCategoryInput = document.getElementById('filter-category-input');
    const filterPriorityInput = document.getElementById('filter-priority-input');
    const filterTasksBtn = document.getElementById('filter-tasks-btn');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');

    // Initialize Flatpickr for time input
    flatpickr(dueTimeInput, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true
    });

    loadTasksFromLocalStorage();

    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value;
        const categoryText = categoryInput.value;
        const dueDate = dueDateInput.value;
        const dueTime = dueTimeInput.value;
        const priority = priorityInput.value;

        if (taskText === '') {
            alert('Please enter a task');
            return;
        }

        const taskItem = document.createElement('li');
        taskItem.classList.add('task');
        taskItem.dataset.category = categoryText;
        taskItem.dataset.priority = priority;

        const taskContent = document.createElement('div');
        taskContent.innerHTML = `
            <strong>${taskText}</strong> <br>
            <small>Category: ${categoryText}</small> <br>
            <small>Due: ${dueDate} ${dueTime}</small> <br>
            <small>Priority: ${priority}</small>
        `;
        taskItem.appendChild(taskContent);

        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Complete';
        completeBtn.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            saveTasksToLocalStorage();
        });
        taskItem.appendChild(completeBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            taskItem.remove();
            saveTasksToLocalStorage();
        });
        taskItem.appendChild(deleteBtn);

        taskList.appendChild(taskItem);

        taskInput.value = '';
        categoryInput.value = '';
        dueDateInput.value = '';
        dueTimeInput.value = '';
        priorityInput.value = 'Medium';

        saveTasksToLocalStorage();
    });

    filterTasksBtn.addEventListener('click', filterTasks);

    clearCompletedBtn.addEventListener('click', () => {
        document.querySelectorAll('.task.completed').forEach(task => task.remove());
        saveTasksToLocalStorage();
    });

    toggleModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    function filterTasks() {
        const filterCategory = filterCategoryInput.value.toLowerCase();
        const filterPriority = filterPriorityInput.value;

        document.querySelectorAll('.task').forEach(task => {
            const matchesCategory = task.dataset.category.toLowerCase().includes(filterCategory);
            const matchesPriority = !filterPriority || task.dataset.priority === filterPriority;

            if (matchesCategory && matchesPriority) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
    }

    function saveTasksToLocalStorage() {
        const tasks = Array.from(document.querySelectorAll('.task')).map(task => ({
            text: task.querySelector('strong').textContent,
            category: task.dataset.category,
            dueDate: task.querySelector('small:nth-child(3)').textContent.split(' ')[1],
            dueTime: task.querySelector('small:nth-child(3)').textContent.split(' ')[2],
            priority: task.dataset.priority,
            completed: task.classList.contains('completed')
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task');
            if (task.completed) {
                taskItem.classList.add('completed');
            }
            taskItem.dataset.category = task.category;
            taskItem.dataset.priority = task.priority;

            const taskContent = document.createElement('div');
            taskContent.innerHTML = `
                <strong>${task.text}</strong> <br>
                <small>Category: ${task.category}</small> <br>
                <small>Due: ${task.dueDate} ${task.dueTime}</small> <br>
                <small>Priority: ${task.priority}</small>
            `;
            taskItem.appendChild(taskContent);

            const completeBtn = document.createElement('button');
            completeBtn.textContent = 'Complete';
            completeBtn.addEventListener('click', () => {
                taskItem.classList.toggle('completed');
                saveTasksToLocalStorage();
            });
            taskItem.appendChild(completeBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                taskItem.remove();
                saveTasksToLocalStorage();
            });
            taskItem.appendChild(deleteBtn);

            taskList.appendChild(taskItem);
        });
    }
});
