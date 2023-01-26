const { cookieParser, updateAge } = require("./utils")
const data = require("../data.json")

//Handler para páginas inválidas
function invalidRoutes(req, res) {
    res.setHeader("Content-Type", "text/plain")
    return res.status(404).send("Error 404.\nWe could not found the page you're looking for")
}

//Atualizando a idade dos contatos uma vez ao dia em caso de aniversário
async function shouldUpdateAges(req, res, next) {
    const agesUpdated = cookieParser(req.headers.cookie).ages_updated
    if (!agesUpdated) {
        res.cookie("ages_updated", "true", { maxAge: 86400000 })
        await updateAge(res, data)
    }
    next()
}

module.exports = { invalidRoutes, shouldUpdateAges }
