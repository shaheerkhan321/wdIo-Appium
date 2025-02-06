
const BasePage = require('./BasePage');

class DashboardPage extends BasePage {
    get dashboardHeader() {
        return $('~dashboard-header');
    }
}

module.exports = DashboardPage;
