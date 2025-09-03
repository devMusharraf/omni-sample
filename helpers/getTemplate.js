async function getTemplate(templateData, templateId) {
  const selectedTemplate = templateData.find(t => t.templateId === templateId);
  if (!selectedTemplate) throw new Error("Template not found");
  return selectedTemplate;
}

module.exports = getTemplate