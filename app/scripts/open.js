(
    /**
     * Small interceptor to rewrite Drive's open/create requests into
     * friendly URLS for our app.
     */
    function() {
        var params = {};
        window.location.search.replace(
            new RegExp("([^?=&]+)(=([^&]*))?", "g"),
            function ($0, $1, $2, $3) {
                params[decodeURIComponent($1)] = decodeURIComponent($3);
            }
        );

        if (params.state) {
            var state = JSON.parse(params.state);
            var path;
            if (state.action == 'create') {
                path = '/create';
            } else if (state.action == 'open') {
                var id = state.ids.shift();
                path = '/todos/'+id+'/';
            } else {
                path = '/install';
            }
            var url = window.location.pathname + '#' + path + '?user=' + state.userId;
            window.history.replaceState({},'', url);
        }
    }
)();