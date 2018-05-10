const Home = {
    data: function() {
        return { 
            todos: []
        }
    },
    methods: {
        diffDates: function(value, type = 'minutes') {
            var now = new Date().toString();

            return moment(String(value)).diff(moment(now), type);
        }
    },
    mounted() {
        var self = this;

        $.ajax({
            method: 'get',
            url: "http://localhost:8080/todo"
        }).then(function(data, status, jqxhr) {
            self.todos = data;
        });
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
                <input type="text" class="form-control" id="search" placeholder="Search todos">
            </div>
            <div class="col-lg-6 mt-4 mt-lg-0">
                <a href="add" class="btn btn-primary" role="button">Add todo</a>
            </div>
        </div>
        <div class="card-columns mt-4">
            <div v-bind:class="[diffDates(todo.dueDate) > 0 ? 'card border-dark mb-3' : 'card border-warning mb-3']" v-for="todo in todos">
                <div class="card-header">
                    <h2 class="card-title mb-0">{{ todo.title }}</h2>
                    <p v-bind:class="[diffDates(todo.dueDate, 'day') <= 1 && diffDates(todo.dueDate) > 0 ? 'text-danger mt-2' : 'text-muted mt-2']">{{ todo.dueDate|formatDate }}</p>
                </div>
                <div class="card-body">
                    <p class="card-text mb-3">{{ todo.content }}</p>
                    <a href="#" class="card-link">Edit</a>
                    <a href="#" class="card-link">Delete</a>
                </div>
            </div>
        </div>
    </div>
    `
};