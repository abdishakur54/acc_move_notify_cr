/** @odoo-module **/
import {browser} from "@web/core/browser/browser";
console.log("browser",browser)
import {registry} from "@web/core/registry";

export const webNotificationService = {
    dependencies: ["action","bus_service", "notification"],

    start(env, {action,bus_service, notification}) {
        let webNotifTimeouts = {};

        bus_service.addEventListener('notification', ({ detail: notifications }) => {
             for (const {payload, type} of notifications) {
                    if (type === "account.move") {
                        displaywebNotification(payload);
                    }
                }
        });
        bus_service.start();

        function displaywebNotification(notifications) {
            Object.values(webNotifTimeouts).forEach((notif) =>
                browser.clearTimeout(notif)
            );
            webNotifTimeouts = {};
            notifications.forEach(function (notif) {
                browser.setTimeout(function () {
                    notification.add(notif.message, {
                        title: notif.title,
                        type: notif.type,
                        sticky: notif.sticky,
                        className: notif.className,
                        buttons: [
                                {
                                    name: env._t("View Invoice"),
                                    primary: true,
                                    onClick: async () => {
                                        await action.doAction({
                                            type: 'ir.actions.act_window',
                                            res_model: 'account.move',
                                            res_id: notif.id,
                                            views: [[false, 'form']],
                                        });
                                    },
                                },
                            ],
                    });
                });
            });
        }
    },
};
registry.category("services").add("webNotification", webNotificationService);
