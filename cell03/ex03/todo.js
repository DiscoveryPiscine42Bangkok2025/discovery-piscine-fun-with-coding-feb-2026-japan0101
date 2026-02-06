// Get elements
const ftList = document.getElementById('ft_list');
const newBtn = document.getElementById('newBtn');

// Cookie name
const COOKIE_NAME = 'ft_todo_list';

// Load todos from cookie when page loads
window.addEventListener('load', function() {
    loadTodosFromCookie();
});

newBtn.addEventListener('click', function() {
    const todoText = prompt('Enter a new TO DO:');
    
    if (todoText && todoText.trim() !== '') {
        addTodo(todoText.trim());
        saveTodosToCookie();
    }
});

function addTodo(text) {
    const todoDiv = document.createElement('div');
    todoDiv.className = 'todo-item';
    todoDiv.textContent = text;
    
    todoDiv.addEventListener('click', function() {
        const confirmed = confirm('Do you want to remove this TO DO?');
        
        if (confirmed) {
            todoDiv.remove();
            saveTodosToCookie();
        }
    });
    
    if (ftList.firstChild) {
        ftList.insertBefore(todoDiv, ftList.firstChild);
    } else {
        ftList.appendChild(todoDiv);
    }
}

function saveTodosToCookie() {
    const todos = [];
    const todoItems = ftList.querySelectorAll('.todo-item');
    
    todoItems.forEach(function(item) {
        todos.push(item.textContent);
    });
    
    const todosJSON = JSON.stringify(todos);
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    
    document.cookie = COOKIE_NAME + '=' + encodeURIComponent(todosJSON) + 
                      '; expires=' + expiryDate.toUTCString() + 
                      '; path=/';
}

function loadTodosFromCookie() {
    const cookies = document.cookie.split(';');
    let todosCookie = null;
    
    for (let cookie of cookies) {
        const trimmedCookie = cookie.trim();
        if (trimmedCookie.startsWith(COOKIE_NAME + '=')) {
            todosCookie = trimmedCookie.substring(COOKIE_NAME.length + 1);
            break;
        }
    }
    
    if (todosCookie) {
        try {
            const todos = JSON.parse(decodeURIComponent(todosCookie));
            
            for (let i = todos.length - 1; i >= 0; i--) {
                addTodo(todos[i]);
            }
        } catch (e) {
            console.error('Error loading todos from cookie:', e);
        }
    }
}
