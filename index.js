class TodoModel {
    constructor() {
        this.todos = [];
    }

    getTodos() {
        return this.todos;
    }

    addTodo(text) {
        const todo = {
            id: new Date().getTime().toString(),
            text: text ? text : '',
            completed: false
        }
        this.todos.push(todo);
        return this.todos;
    }

    editTodo(id, text, completed) {
        if (id == null) {
            throw "Please provide an id"
        }
        this.todos = this.todos.map(todo => {
            if(todo.id === id) {
                return {
                    id,
                    text: text ? text : todo.text,
                    completed: completed != null ? completed : todo.completed
                }
            }
            return todo;
        });
        return this.todos;
    }

    deleteTodo(id) {
        if (id == null) {
            throw "Please provide an id"
        }
        this.todos = this.todos.filter(todo => {
            return todo.id !== id
        });
        return this.todos;
    }

}

class TodoView {
    constructor() {
        this.app = document.querySelector('#root');

        // title of the app
        this.title = document.createElement('h1');
        this.title.textContent = 'Todos App';

        // input field
        this.inputForm = this.createElement('form');
        
        this.inputField = this.createElement('input');
        this.inputField.name = 'input-todo-text';
        this.inputField.placeholder = 'Enter todo text';
        this.inputField.type = 'text';

        this.submitButton = this.createElement('button');
        this.submitButton.textContent = 'Submit';

        this.inputForm.append(this.inputField, this.submitButton);

        // create the todo list displaying area
        this.todoListsEl = document.createElement('ul', 'todo-list')

        // empty list el
        this.emptyTodosText = document.createElement('div');
        this.emptyTodosText = 'Please add todos to display';

        // save button
        this.saveBtnEl = document.createElement('button');
        this.saveBtnEl.textContent = 'SAVE';

        this.app.append(this.title, this.saveBtnEl, this.inputForm, this.todoListsEl);
        
    }

    displayTodoList (todos) {
        this.todoListsEl.innerHTML = '';

        if(todos.length == 0) {
            this.todoListsEl.append(this.emptyTodosText);
        } else {
            todos.forEach(todo => {
                this.todoListsEl.append(this.getTodoEl(todo));
            });
        }
    }

    getTodoEl(todo) {
        const todoEl = document.createElement('li');
        todoEl.id = todo.id;

        const checkboxEl = document.createElement('input', 'todo-check');
        checkboxEl.type = 'checkbox';
        checkboxEl.checked = todo.completed;

        const textEl = document.createElement('span', 'todo-text');
        textEl.textContent = todo.text;
        textEl.contentEditable = true;
        if (todo.completed == true) {
            textEl.style.textDecoration = 'line-through';
        }

        const deleteBtn = document.createElement('button', 'todo-btn');
        deleteBtn.textContent = 'DELETE';

        todoEl.append(checkboxEl, textEl, deleteBtn);
        return todoEl;
    }

    getInputValue() {
        return this.inputField.value;
    }

    setInputValue(val) {
        this.inputField.value = val;
    }

    createElement (el, className) {
        const newEl = document.createElement(el);
        if (className != null) {
            newEl.classList.add(className)
        }

        return newEl;
    }

    getElement (sel) {
        const el =  document.querySelector(sel);
        return el;
    }
}

class TodoController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.inputForm.addEventListener('submit', this.handleAddTodo.bind(this));
        this.view.todoListsEl.addEventListener('click', this.handleTodoClick.bind(this));
        this.view.todoListsEl.addEventListener('focusout', this.handleTodoChanged.bind(this));
        this.view.saveBtnEl.addEventListener('click', this.handleSaveChanges.bind(this));

        const savedTodos = localStorage.getItem('todos');
        if(savedTodos != null) {
            this.model.todos = JSON.parse(savedTodos);
        }

        this.onTodoListChanged(this.model.getTodos());
    }

    onTodoListChanged(todos) {
        this.view.displayTodoList(todos);
    }

    handleAddTodo(e) {
        e.preventDefault();
        const val = this.view.getInputValue();
        this.model.addTodo(val);
        this.onTodoListChanged(this.model.getTodos());
        this.view.setInputValue('');
    }

    handleTodoClick(e) {
        e.preventDefault();
        if(e.target.type == 'submit') {
            this.model.deleteTodo(e.target.parentElement.id);
            this.onTodoListChanged(this.model.getTodos());
        } else if (e.target.type == 'checkbox') {
            this.model.editTodo(e.target.parentElement.id, null, e.target.checked);
            this.onTodoListChanged(this.model.getTodos());
        }
    }

    handleTodoChanged(e) {
        e.preventDefault();
        this.model.editTodo(e.target.parentElement.id, e.target.textContent);
        this.onTodoListChanged(this.model.getTodos());
    }

    handleSaveChanges(e) {
        e.preventDefault();
        localStorage.setItem('todos', JSON.stringify(this.model.getTodos()));
    }
}

const TM = new TodoModel();
const TV = new TodoView();
const TC = new TodoController(TM, TV);