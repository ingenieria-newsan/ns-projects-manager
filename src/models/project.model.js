// @ts-check
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Project = new Schema(
{
    projectDeleted: { type: Boolean, default: false },
    projectStatus: { type: Number, default: 20 },
    projectRequiredTasks: { type: Number, default: 0 },
    projectCompletedTasks: { type: Number, default: 0 },
    projectStartDate: { type: Date, default: Date.now },
    projectFinishDate: { type: Date },
    projectCloseDate: { type: Date },
    
    projectBiz: { type: String },
    projectLeader: { type: String },
    projectRequiredDate: { type: String },
    
    productType: { type: String },
    productDescription: { type: String },
    productionSchema: { type: String },
    productBrand: { type: String },
    productModel: { type: String },
    
    supplierName: { type: String },
    supplierModel: { type: String },
    
    facilityName: { type: String },
    
    productEvalChina:
    {
        required: { type: Boolean, default: false },
        closed: { type: Boolean, default: false },
        starts: { type: Date },
        ends: { type: Date },
        result: { type: String },
    },

    productEvalArgentina:
    {
        required: { type: Boolean, default: false },
        closed: { type: Boolean, default: false },
        starts: { type: Date },
        ends: { type: Date },
        result: { type: String },
    },

    productCert:
    {
        required: { type: Boolean, default: false },
        closed: { type: Boolean, default: false },
        status: { type: String },
        certBody: { type: String },
        certLab: { type: String },
        starts: { type: Date },
        ends: { type: Date }
    },

    productSetup:
    {
        required: { type: Boolean, default: false },
        closed: { type: Boolean, default: false }
    },

    productRatingLabel:
    {
        required: { type: Boolean, default: false },
        closed: { type: Boolean, default: false }
    },

    productUserManual:
    {
        required: { type: Boolean, default: false },
        closed: { type: Boolean, default: false }
    },
    
    productGiftBox:
    {
        required: { type: Boolean, default: false },
        closed: { type: Boolean, default: false }
    },

    productMasterBox:
    {
        required: { type: Boolean, default: false },
        closed: { type: Boolean, default: false }
    },

    productSoftware:
    {
        required: { type: Boolean, default: false },
        closed: { type: Boolean, default: false }
    },

    productBom:
    {
        required: { type: Boolean, default: false },
        closed: { type: Boolean, default: false }
    },

    productEnacom:
    {
        required: { type: Boolean, default: false },
        closed: { type: Boolean, default: false }
    },

    productEficiency:
    {
        required: { type: Boolean, default: false },
        closed: { type: Boolean, default: false }
    },

},
{ 
    timestamps: true
} );

module.exports = mongoose.model('project', Project);
