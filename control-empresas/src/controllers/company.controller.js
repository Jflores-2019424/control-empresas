'use strict'

const Company = require("../models/company.model");
const bcrypt = require("bcrypt");
const {generateJWT} = require("../helpers/create-jwt")


//Funciones de Empresas

const createCompany = async(req,res) =>{
    const {name, email, password} = req.body;
    try{
        let company = await Company.findOne({email: email});
        if(company){
            res.status(400).send({
                message:"Esta Empresa ya existe",
                ok:false,
                company: company
            });
        }
        company = new Company(req.body)

        const saltos = bcrypt.genSaltSync();
        company.password = bcrypt.hashSync(password, saltos);

        company = await company.save();

        const token = await generateJWT(company.id, company.name, company.email);
        res.status(200).send({
            ok: true,
            message:`Empresa creada correctamente`,
            company,
            token
        })
    }catch(err){
        throw new Error(err);
    }
};

const listCompany = async(req,res) =>{
    try{
        const company = await Company.find();
        if(!company){
            res.status(404).send({
                message:"No hay datos existentes",
                ok: false
            })
        }else{
            res.status(200).send({"Empresas encontradas": company})
        }
    }catch(err){
        throw new Error(err);
    }
};

const updateCompany = async(req,res) =>{
  try{
    const id = req.params.id;
    const companyEdit = {...req.body};

    companyEdit.password = companyEdit.password
    ? bcrypt.hashSync(companyEdit.password,bcrypt.genSaltSync())
    : companyEdit.password;

    const companyComplete = await Company.findByIdAndUpdate(id, companyEdit, {new: true});
    if(companyComplete){ 
        const token = await generateJWT(
            companyComplete.id,
            companyComplete.name,
            companyComplete.email
        )
    return res.status(200).send({
        message:"Empresa actualizada correctamente",
        companyComplete,
        token
    });
}else{
    res.status(404).send({message:"Empresa no encontrada"})
}
  }catch(err){
    throw new Error(err);
  }  
};

const deleteCompany = async(req,res) =>{
    try{
        const id = req.params.id;
        const companyDelete = await Company.findByIdAndDelete(id);
        return res.status(200).send({
            message:"Empresa eliminada correctamente",
            companyDelete
        });
    }catch(err){
        throw new Error(err);
    }
};

const loginCompany = async(req,res) =>{
    const {email, password} = req.body;
    try{
        const company = await Company.findOne({email});
        if(!company){
            return res.status(400).send({
                ok: false,
                message:"Empresa inexsistente"
            });
        }
        const validPassword = bcrypt.compareSync(
            password,
            company.password
        );

        if(!validPassword){
            return res.status(400).send({
                message:"Contraseña incorrecta",
                ok:false
            })
        }

        const token = await generateJWT(company.id, company.name, company.email);
        res.json({
            ok: true,
            uid: company.id,
            name: company.name,
            email: company.email,
            token
        });
    }catch(err){
        throw new Error(err);
    }
};

//Funciones de sucursales

const createCompanyBranch = async(req,res) =>{
    try{
        const id = req.params.id
        const {name, ubication} = req.body;

        const companyBranch = await Company.findByIdAndUpdate(
            id,
            {
                $push: {
                    branch: {
                        name: name,
                        ubication: ubication,
                    },
                },
            },
            {new: true}
        );
        if(!companyBranch){
            return res.status(404).send({message:"Empresa no encontrada"});
        }

        return res.status(200).send({companyBranch});
    }catch(err){
        throw new Error(err);
    }
};

const updateCompanyBranch = async(req,res) =>{
    const id = req.params.id;
    const { idBranch, name, ubication} = req.body;
    try{
    const updateBranch = await Company.updateOne(
        { _id:id, "branch._id": idBranch},
        {
            $set:{
                "branch.$.name": name,
                "branch.$.ubication": ubication,
            },
        },
        {new:true}
    );

    if(!updateBranch){
        return res.status(404).send({message:"Empresa inexistente"});
    }

    return res.status(200).send({
        updateBranch,
        message:"Sucursal actualizada correctamente"
    })
    }catch(err){
        throw new Error(err);
    }
};

const deleteCompanyBranch = async(req,res) =>{
    const id = req.params.id;
    const { idBranch } = req.body;
    try{
        const deleteBranch = await Company.updateOne(
            {id},
            {
                $pull:{ branch: {_id: idBranch}},
            },
            {new: true, multi:false}
        );

        if(!deleteBranch){
            return res.status(404).send({
                message:"Empresa inexistente"
            })
        }

        return res.status(200).send({deleteBranch});
    }catch(err){
        throw new Error(err);
    }
}; 

const searchBranch = async(req,res) =>{
    const id = req.params.id;
    try{
        const companyBranch = await Company.findById(id);
        if(!companyBranch){
            res.status(404).send({
                message:"No hay datos existentes",
                ok: false
            })
        }else{
            res.status(200).send({"Empresas encontradas": companyBranch})
        }
    }catch(err){
        throw new Error(err);
    }
};

module.exports = {
    createCompany,
    listCompany,
    updateCompany,
    deleteCompany,
    loginCompany,
    createCompanyBranch,
    updateCompanyBranch,
    deleteCompanyBranch,
    searchBranch};