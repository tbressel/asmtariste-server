"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuild {
    /**
     *
     * Private method to get the up and down queries.
     * 1st querie : results send 2 rows except if the row is the first (when action is up) or the last (when action is down).
     * 2nd querie : update the place of the row.
     *
     * @param action
     * @returns
     */
    upDownQueries(action) {
        var queryUpDown = "";
        if (action === "up") {
            queryUpDown = "SELECT id_menu, place FROM menu WHERE place <= (SELECT place FROM menu WHERE id_menu = ?) ORDER BY place DESC LIMIT 2;";
        }
        if (action === "down") {
            queryUpDown = "SELECT id_menu, place FROM menu WHERE place >= (SELECT place FROM menu WHERE id_menu = ?) ORDER BY place ASC LIMIT 2;";
        }
        return {
            'queryUpDown': queryUpDown,
            'queryUpdate': 'UPDATE menu SET place = ? WHERE id_menu = ?;'
        };
    }
    ;
    getUpDownQuery(action) {
        return this.upDownQueries(action);
    }
}
exports.default = QueryBuild;
