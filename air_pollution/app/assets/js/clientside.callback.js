window.dash_clientside = Object.assign({}, window.dash_clientside, {
    clientside: {
        toggle_modal: function (n_clicks_open, is_open) {
            if (n_clicks_open) {
                return !is_open;
            }
            return is_open;
        }
    }
});
