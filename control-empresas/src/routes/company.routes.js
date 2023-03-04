'use strict'

const {Router} = require("express");
const {
    createCompany, 
    updateCompany,
    deleteCompany, 
    listCompany,
    loginCompany,
    createCompanyBranch,
    updateCompanyBranch,
    deleteCompanyBranch,
    searchBranch
} = require("../controllers/company.controller");
const {check} = require("express-validator");
const {validateParams} = require("../middlewares/validate-params");
const {validateJWT} = require("../middlewares/validate-jwt");

const api = Router();

api.post("/create-company", createCompany);

api.put("/update-company/:id", updateCompany);

api.delete("/delete-company/:id", deleteCompany);

api.get("/list-company", listCompany);

api.post("/login", loginCompany);

api.put("/create-branch/:id", createCompanyBranch);

api.put("/update-branch/:id", updateCompanyBranch);

api.get("/search-branch/:id", searchBranch)

api.delete("/delete-branch/:id", deleteCompanyBranch);

module.exports = api;