'use strict';

module.exports = function(Stock) {
    Stock.observe('after save', function (ctx, next) {
        console.log('supports isNewInstance?', ctx.isNewInstance !== undefined);
        console.log('')
        debugger
        next();
    });
    Stock.observe('before save', async function (ctx, next) {
        console.log('supports isNewInstance?', ctx.isNewInstance !== undefined);
        debugger;
        const id = ctx.instance.$id
        if(id) {
            const previousValue = await Stock.findById(id)
            ctx.hookState = {
                previousValue
            }
            ctx.options = {
                ...ctx.options,
                previousValue
            }
        }
        next();
    });
};
