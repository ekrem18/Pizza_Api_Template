"use strict"
/* -------------------------------------------------------*/
// Pizza Controller:

const Pizza = require('../../models/pizza')

module.exports = {

    list: async (req, res) => {

        const data = await res.getModelList(Pizza, {}, 'toppings')

       
        // Add '?' parameters to url if there is not:
        if (!req.originalUrl.includes('?')) req.originalUrl += '?'      //---Z originalURL domainden gelen full UR'yi verirken, URL router içindeki URL 'yi veriyor

        res.render('pizzaList', {
            details: await res.getModelListDetails(Pizza),
            pizzas: data,
            pageUrl: req.originalUrl.replace(/[?|&]page=([^&]+)/gi, '')
        })
    },

    create: async (req, res) => {

        if (req.method == 'POST') {

            const data = await Pizza.create(req.body)
    
            // res.status(201).send({
            //     error: false,
            //     data
            // })

            res.redirect('/pizzas/' + data.id)

        } else {

            res.render('pizzaForm', {
                pizza: null
            })
        }
    },

    read: async (req, res) => {

        const data = await Pizza.findOne({ _id: req.params.id }).populate('toppings')

        // res.status(200).send({
        //     error: false,
        //     data
        // })
        
        res.render('pizzaRead', {
            pizza: data,
        })

    },

    update: async (req, res) => {

        if (req.method == 'POST') {

            const data = await Pizza.updateOne({ _id: req.params.id }, req.body, { runValidators: true })
    
            // res.status(202).send({
            //     error: false,
            //     data,
            //     new: await Pizza.findOne({ _id: req.params.id })
            // })

            res.redirect('/pizzas/' + req.params.id)

        } else {

            res.render('pizzaForm', {
                pizza: await Pizza.findOne({ _id: req.params.id }).populate('toppings')
            })
        }

    },

    delete: async (req, res) => {

        const data = await Pizza.deleteOne({ _id: req.params.id })
        
        // Go to home:
        res.redirect('/pizzas')

    },

    // Add toppings to Pizza.toppings:
    pushToppings: async (req, res) => {

        const toppings = req.body?.toppings
        
        const data = await Pizza.updateOne({ _id: req.params.id }, { $push: { toppings: toppings } })
        const newData = await Pizza.findOne({ _id: req.params.id }).populate('toppings')

        res.status(202).send({
            error: false,
            data,
            toppingsCount: newData.toppings.length,
            new: newData
        })
    },

    // Remove toppings from Pizza.toppings:
    pullToppings: async (req, res) => {

        const toppings = req.body?.toppings
        
        const data = await Pizza.updateOne({ _id: req.params.id }, { $pull: { toppings: toppings } })
        const newData = await Pizza.findOne({ _id: req.params.id }).populate('toppings')

        res.status(202).send({
            error: false,
            data,
            toppingsCount: newData.toppings.length,
            new: newData
        })
    },
}