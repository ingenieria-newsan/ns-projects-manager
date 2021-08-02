const express = require('express');
const router = express.Router();

const options = require('../config/app-options.json');
const Project = require('../models/project.model');

module.exports = () =>
{
    /* ruta para listar todos los proyectos */
    router.get( '/todos', async (req,res) => 
    {
        let projects = await Project.find();
        res.render('pages/proyectos/list', { projects } ) 
    });

    router.get( '/activos', (req,res) => res.render('pages/proyectos/list'));
    router.get( '/asignados', (req,res) => res.render('pages/proyectos/list'));
    
    /* muestra el form para crear un nuevo proyecto */
    router.get( '/nuevo', (req,res) => res.render('pages/proyectos/new', { options }));

    /* guardar un proyecto nuevo */
    router.post( '/nuevo', async (req,res) => 
    {
        let project = new Project(req.body);
        let project_new = await project.save();
        res.redirect(`/proyectos/editar/${project_new._id}`);
    });
    
    /* editar un proyecto */
    router.get( '/editar/:id', async (req,res) =>
    {
        let project = await Project.findById(req.params.id);

        if ( project != null ) res.render('pages/proyectos/edit', { project, options }) ;
        //// TO DO: redirect a página de ERRORES ////
        else res.send(`<code>(ERROR) Document ${req.params.id} can't be found.<code>`); 

    });

    /* guardar cambios */
    router.post( '/editar/:id', async (req,res) => 
    {
        /* variables */
        let data = dataFormatter( req.body );
        
        /* actualizo documento en bd */
        try
        {
            await Project.updateOne( { _id:req.params.id }, data )
            console.log( `< INFO > document ${req.params.id} updated.` );
            res.redirect(`/proyectos/editar/${req.params.id}`);    
        }
        catch (error)
        {
            console.log( `< ERROR > document ${req.params.id} can't be updated due to following error: ${error}.` );
            res.send(`<code>(ERROR) Document ${req.params.id} can't be updated due to following error: ${error}.<code>`);

            //// TO DO: redirect a página de ERRORES ////
        }

    });
    
    return router;
};

function dataFormatter(data)
{
    /* variables */
    let requiredTasks = 0;
    let completedTasks = 0;

    /* Evaluación China */
    if(data.productEvalChinaRequired)
    {
        // sumar como tarea requerida
        requiredTasks++;
        
        // determino si está cerrada la tarea
        let isClosed = false;
        if( data.productEvalChinaStarts && data.productEvalChinaEnds && data.productEvalChinaResult ) 
        {   
            isClosed = true;
            completedTasks++;
        } 
        
        // actualizo la información de la tarea 
        data.productEvalChina =
        {
            required:true,
            closed:isClosed,
            starts:data.productEvalChinaStarts,
            ends:data.productEvalChinaEnds,
            result:data.productEvalChinaResult
        };
    }
    else data.productEvalChina = { required : false };
    
    /* Evaluación Argentina */
    if(data.productEvalArgentinaRequired)
    {
        // sumar como tarea requerida
        requiredTasks++;
        
        // determino si está cerrada la tarea
        let isClosed = false;
        if( data.productEvalArgentinaStarts && data.productEvalArgentinaEnds && data.productEvalArgentinaResult ) 
        {   
            isClosed = true;
            completedTasks++;
        } 
        
        // actualizo la información de la tarea 
        data.productEvalArgentina =
        {
            required:true,
            closed:isClosed,
            starts:data.productEvalArgentinaStarts,
            ends:data.productEvalArgentinaEnds,
            result:data.productEvalArgentinaResult
        };
    }
    else data.productEvalArgentina = { required : false };

    /* Certificación de producto */
    if ( data.productCertRequired ) 
    {
        // sumar como tarea requerida
        requiredTasks++;

        // determino si está cerrada la tarea
        let isClosed = false;
        if( data.productCertStatus ==  "Finalizado" ) 
        {   
            isClosed = true;
            completedTasks++;
        }           

        // actualizo la información de la tarea 
        data.productCert =
        {
            required:true,
            closed:isClosed,
            status:data.productCertStatus,
            certBody:data.productCertBody,
            certLab:data.productCertLab,
            starts:data.productCertStarts,
            ends:data.productCertEnds
        };
    }
    else data.productCert = { required : false };

    /* Consolidación */
    if ( data.productSetupRequired ) 
    {
        // sumar como tarea requerida
        requiredTasks++;

        // determino si está cerrada la tarea
        let isClosed = false;
        if( data.productSetupCompleted ) 
        {   
            isClosed = true;
            completedTasks++;
        }

        // actualizo la información de la tarea 
        data.productSetup =
        {
            required:true,
            closed:isClosed
        };
    }
    else data.productSetup = { required : false };

    /* Etiqueta del Producto */
    if ( data.productRatingLabelRequired ) 
    {
        // sumar como tarea requerida
        requiredTasks++;

        // determino si está cerrada la tarea
        let isClosed = false;
        if( data.productRatingLabelCompleted ) 
        {   
            isClosed = true;
            completedTasks++;
        }

        // actualizo la información de la tarea 
        data.productRatingLabel =
        {
            required:true,
            closed:isClosed
        };
    }
    else data.productRatingLabelRequired = { required : false };
       
    /* calculo de estado del proyecto*/
    if ( requiredTasks > 0 && completedTasks > 0 ) { data.projectStatus = 30 } // en proceso
    else { data.projectStatus = 20 } // pendiente
    if ( requiredTasks > 0 && requiredTasks == completedTasks ) // finalizado sin embarque o producción
    {
        data.projectStatus = 40;
        data.projectFinishDate = Date.now()
        if ( data.projectCloseDate ) { data.projectStatus = 50; } // finalizado
    }
    if ( data.productEvalArgentina.result == 'Rechazado' || data.productEvalChina.result == 'Rechazado' ) // finalizado por evaluacion rechazada
    {
        data.projectStatus = 50;
        data.projectFinishDate = Date.now();
        data.projectCloseDate = Date.now();
    }
    if ( data.projectStandBy ) { data.projectStatus = 10; } // standby
    if ( data.projectCancel ) { data.projectStatus = 0; } // cancelado

    /* retorna el objeto procesado */
    return data
}
