const mongoose = require("mongoose");
const { randomId } = require("../utils/randomId");

const templateSchema = new mongoose.Schema({
    templateId: {
        type: String,
       default: () => randomId(),
    },
    messageType: {
        type: String,
        enum: ["text_variable", "textArea"]
        
    },
    textArea: {
        type: String,
        default: ''
    },
   
    createdAt: {
        type: Date,
        default: Date.now()
    },
    userId: {
        type: String,
        default: ""

    },
    parentId: {
        type: String,
        default: ""
    },
    text_variable :{
        type: Array,
        default: []
    },
    previewMessage: {
        type: String,
        default: ""
    }, 
    
})




class TemplateClass {
    static async addTemplate(newTemplate){
        return this.create(newTemplate)
    }

    static async getTemplate(templates) {
        return this.find()
    }
    static async editTemplate(updatedTemplate) {
        return this.findOneAndUpdate()
    }
    static async deleteTemplate() {
        return this.findOneAndDelete()
    }
    static async getOneTemplate(template) {
        return this.findOne()
    }
   
}
templateSchema.loadClass(TemplateClass);
const Template = mongoose.model("Template", templateSchema)
module.exports = Template

