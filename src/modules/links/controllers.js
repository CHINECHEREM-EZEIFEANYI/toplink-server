// all the controllers come in here
const Response = require('../../utils/response');
const { validateData } = require("../../utils/validator");
const { linkSchemaValidator } = require("./schema");
const Link = require("./models");
const Joi = require('joi');

exports.createLink = async (req, res) => {
    // validate here
    try {
        let link = req.body;
        let validatedData = await validateData(link, linkSchemaValidator);

        // if the link data is not valid, return an error response
        if (!validatedData.isValid) {
            let response = new Response(400, (validatedData.error.message ? validatedData.error.message : validatedData.error)).error();
            res.status(response.code).send(response);
            return;
        }

        // checking if author exists
        if(!(await Link.authorExists(link.author))) {
            // if no author exists
            let response = new Response(400, "invalid author id provided").error();
            res.status(response.code).send(response);
            return;
        }

        // checking if the same link exists for this user
        if (!(await Link.isUnique(link.url, link.author))) {
            let response = new Response(400, "link already exists").error();
            res.status(response.code).send(response);
            return;
        }
       
        // save the link to db after passing validation
        const result = await Link.create(link);
        let response = new Response(201, "Link created successfully", result).successData();
        res.status(response.code).send(response);
        return;
        
    } catch (error) {
        let response = new Response(400, (error.message ? error.message : error)).error();
        res.status(response.code).send(response);
        return;
    }
}

exports.getLinkById = async (req, res) => {
    // validate here
    try {
        let id = req.params.id
        const result = await Link.getById(id);
        let response = new Response(200, "fetched link successfully", result).successData();
        res.status(response.code).send(response);
        
    } catch (error) {
        let response = new Response(400, (error.message ? error.message : error)).error();
        res.status(response.code).send(response);
    }
}

exports.updateLink = async (req, res) => {
    // validate here
    let id = req.params.id;
    const linkData = req.body;
    try {
        // checking if author provided owns the link to be updated
        if(!(await Link.authorExists(linkData.author, id))) {
            // if no author exists
            let response = new Response(400, "invalid author id provided").error();
            res.status(response.code).send(response);
            return;
        }
        
        if (linkData.url) {
            // checking if the new url to be updated is a valid url
            try {
              await Joi.string().uri().validateAsync(linkData.url);
            } catch (error) {
                let response = new Response(400, "url must be valid url").error();
                res.status(response.code).send(response);
                return;
            }
        
            // checking if the new link is unique to the author
            if (!(await Link.isUnique(linkData.url, linkData.author))) {
                let response = new Response(
                    400,
                    "This link already exists with this author "
                ).error();
                res.status(response.code).send(response);
                return;
            }
        }
        
        // checking if the new icon url to be updated is a valid url
        if(linkData.icon) {
            try {
                await Joi.string().uri().validateAsync(linkData.icon);
            } catch (error) {
                let response = new Response(400, "icon must be a valid url").error();
                res.status(response.code).send(response);
                return;
            }
        }
        
        // updating link
        const result = await Link.update(id, linkData);
        let response = new Response(200, "Link updated successfully", result).successData();
        res.status(response.code).send(response);
        return;

    } catch (error) {
        let response = new Response(400, (error.message ? error.message : error)).error();
        res.status(response.code).send(response);
        return;
    }
}

exports.deleteLink = async (req, res) => {
    // validate here
    try {
        let id = req.params.id;
        const result = await Link.delete(id);
        let response = new Response(200, "link deleted successfully").successMessage();
        res.status(response.code).send(response);
    } catch (error) {
        let response = new Response(400, (error.message ? error.message : error)).error();
        res.status(response.code).send(response);
    }
}
