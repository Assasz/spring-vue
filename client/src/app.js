const NotFound = { 
    template: `
        <div id="not_found">
            <h1 class="text-danger mt-4">404</h1>
            <p>Page not found.</p>
        </div>
    `
};

const routes = {
    '/': Home
};

new Vue({
    el: '#app',
    computed: {
        currentRoute () {
            var path = window.location.pathname;
            return path.substring(12, path.length);
        },
        view () {
            return routes[this.currentRoute] || NotFound;
        }
    },
    render (h) { 
        return h(this.view); 
    }
});