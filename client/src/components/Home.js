const Home = {
    data: function() {
        return { 
            todos: [],
            currentTodo: null
        }
    },
    methods: {
        diffDates: function(value, type = 'minutes') {
            var now = new Date().toString();
            return moment(String(value)).diff(moment(now), type);
        },
        toggleModal: function(target, event, todoId = null) {
            event.preventDefault();

            $('.form-control').removeClass('is-valid is-invalid');
            $('#' + target).modal();

            if(todoId !== null){
                this.currentTodo = todoId;

                if(target === 'edit_modal'){
                    $.ajax({
                        method: 'get',
                        url: apiUrl + '/' + this.currentTodo
                    }).then(function(data, status, jqxhr) {
                        $('#edit_title').val(data.title);
                        $('#edit_content').val(data.content);
                        $('#edit_due_date').val(moment(data.dueDate).format('YYYY-MM-DDTHH:mm'));
                    });
                }
            }
        },
        getValidationOptions: function() {
            return {
                rules: {
                    title: {
                        required: true,
                        maxlength: 255,
                        normalizer: function(value) {
                            return $.trim(value);
                        }
                    },
                    content: {
                        required: true,
                        maxlength: 500,
                        normalizer: function(value) {
                            return $.trim(value);
                        }
                    },
                    dueDate: {
                        required: true,
                        date: true,
                        normalizer: function(value) {
                            return $.trim(value);
                        }
                    }
                },
                onkeyup: false,
                errorClass: "is-invalid",
                validClass: "is-valid",
                errorElement: "div",
                errorPlacement: function(error, element) {
                    error.appendTo( element.parent() );
                }
            };
        },
        addTodo: function() {
            if ($("#create_form").valid()) {
                var self = this,
                    data = {
                        title: $('#title').val(),
                        content: $('#content').val(),
                        dueDate: $('#due_date').val(),
                    };

                $.ajax({
                    method: 'post',
                    url: apiUrl,
                    data: JSON.stringify(data),
                    contentType: "application/json"
                }).then(function(data, status, jqxhr) {
                    self.todos.unshift(data);
                    $('#create_modal').modal('hide');
                });   
            } 
        },
        editTodo: function() {
            if ($("#edit_form").valid()) {
                var self = this,
                    data = {
                        title: $('#edit_title').val(),
                        content: $('#edit_content').val(),
                        dueDate: $('#edit_due_date').val()
                    };

                $.ajax({
                    method: 'put',
                    url: apiUrl + '/' + this.currentTodo,
                    data: JSON.stringify(data),
                    contentType: "application/json"
                }).then(function(data, status, jqxhr) {
                    var dueDate = moment(String(data.dueDate)).endOf('minutes').fromNow() + ' - ' + moment(String(data.dueDate)).format('MMMM Do YYYY, hh:mm');

                    $('#' + self.currentTodo + ' #todo_title').html(data.title);
                    $('#' + self.currentTodo + ' #todo_due_date').html(dueDate);
                    $('#' + self.currentTodo + ' #todo_content').html(data.content);

                    $('#edit_modal').modal('hide');
                });   
            } 
        },
        deleteTodo: function() {
            var self = this;

            $.ajax({
                method: 'delete',
                url: apiUrl + '/' + this.currentTodo,
            }).then(function(data, status, jqxhr) {
                if(data){
                    var index = self.todos.findIndex(function(element) {
                        return element.id == self.currentTodo;
                    });

                    self.todos.splice(index, 1);
                    $('#delete_modal').modal('hide');
                }
            });   
        },
        searchTodos: function() {
            var self = this,
                data = {
                    searchTerm: $('#search').val()
                };

            $.ajax({
                method: 'post',
                url: apiUrl + '/search',
                data: JSON.stringify(data),
                contentType: "application/json"
            }).then(function(data, status, jqxhr) {
                self.todos = data;
            });   
        }
    },
    mounted() {
        var self = this;

        $.ajax({
            method: 'get',
            url: apiUrl
        }).then(function(data, status, jqxhr) {
            self.todos = data;
        });

        $("#create_form").validate(this.getValidationOptions());
        $("#edit_form").validate(this.getValidationOptions());
    },
    filters: {
        formatDate: function(value) {
            if (value) {
                return moment(String(value)).endOf('minutes').fromNow() + ' - ' + moment(String(value)).format('MMMM Do YYYY, hh:mm');
            }
        }
    },
    template: `
        <div id="home">
            <h1 class="mt-4">My ToDo's</h1>
            <div class="row mt-4">
                <div class="col-lg-6">
                    <label for="search" class="offscreen">Search todos</label>
                    <input type="text" class="form-control" id="search" name="search" placeholder="Search todos" v-on:keyup="searchTodos">
                </div>
                <div class="col-lg-6 mt-4 mt-lg-0">
                    <button type="button" class="btn btn-primary" v-on:click="toggleModal('create_modal', $event)">Add todo</a>
                </div>
            </div>

            <div id="todos" class="card-columns mt-4">
                <div v-bind:id="todo.id" v-bind:class="[diffDates(todo.dueDate) > 0 ? 'card border-dark mb-3' : 'card border-warning mb-3']" v-for="todo in todos">
                    <div class="card-header">
                        <h2 id="todo_title" class="card-title mb-0">{{ todo.title }}</h2>
                        <p id="todo_due_date" v-bind:class="[diffDates(todo.dueDate, 'day') <= 1 && diffDates(todo.dueDate) > 0 ? 'text-danger mt-2' : 'text-muted mt-2']">{{ todo.dueDate|formatDate }}</p>
                    </div>
                    <div class="card-body">
                        <p id="todo_content" class="card-text mb-3">{{ todo.content }}</p>
                        <a href="#" class="card-link" v-on:click="toggleModal('edit_modal', $event, todo.id)">Edit</a>
                        <a href="#" class="card-link" v-on:click="toggleModal('delete_modal', $event, todo.id)">Delete</a>
                    </div>
                </div>
            </div>
            
            <div id="create_modal" class="modal fade">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Add todo</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form id="create_form">
                                    <div class="form-group">
                                        <label for="title">Title</label>
                                        <input type="text" class="form-control" id="title" name="title">
                                    </div>
                                    <div class="form-group">
                                        <label for="content">Content</label>
                                        <textarea rows="3" class="form-control" id="content" name="content"></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="due_date">Due date</label>
                                        <input type="datetime-local" class="form-control" id="due_date" name="dueDate">
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" v-on:click="addTodo">Create</button>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            
            <div id="edit_modal" class="modal fade">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit todo</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id="edit_form">
                                <div class="form-group">
                                    <label for="edit_title">Title</label>
                                    <input type="text" class="form-control" id="edit_title" name="title">
                                </div>
                                <div class="form-group">
                                    <label for="edit_content">Content</label>
                                    <textarea rows="3" class="form-control" id="edit_content" name="content"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="edit_due_date">Due date</label>
                                    <input type="datetime-local" class="form-control" id="edit_due_date" name="dueDate">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" v-on:click="editTodo">Save changes</button>
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="delete_modal" class="modal fade">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Delete todo</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p>Are you sure you want to delete this todo?</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" v-on:click="deleteTodo">Delete</button>
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};