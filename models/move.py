from odoo import api, Command, fields, models, _

class AccountMove(models.Model):
    _inherit = "account.move"

    @api.model
    def create(self, vals):
        res = super(AccountMove, self).create(vals)
        msg = str(len(res)) + ' ' + 'Move Created.'
        self.env.user.notify_info(title='Invoice',id=res.id,message=msg)
        return res
