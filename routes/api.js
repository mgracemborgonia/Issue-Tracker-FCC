'use strict';

const project_issue = {};
module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let project_query = req.query
      let response = project_issue[project];
      if(!project_query){
        return res.json(response);
      }
      if(project_query.open){
        response = response.filter(resp => resp.open == project_query.open )
      }
      if(project_query.created_by){
        response = response.filter(resp => resp.created_by == project_query.created_by )
      }
      if(project_query.assigned_to){
        response = response.filter(resp => resp.assigned_to == project_query.assigned_to )
      }
      if(project_query.status_text){
        response = response.filter(resp => resp.status_text == project_query.status_text )
      }
      if(project_query._id){
        response = response.filter(resp => resp._id == project_query._id )
      }
      if(project_query.issue_title){
        response = response.filter(resp => resp.issue_title == project_query.issue_title )
      }
      if(project_query.issue_text){
        response = response.filter(resp => resp.issue_text == project_query.issue_text )
      }
      if(project_query.created_on){
        response = response.filter(resp => resp.created_on == project_query.created_on )
      }
      if(project_query.updated_on){
        response = response.filter(resp => resp.updated_on == project_query.updated_on )
      }
      return res.json(response);
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let {issue_title} = req.body;
      let {issue_text} = req.body;
      let {created_by} = req.body;
      let {assigned_to} = req.body;
      let {status_text} = req.body;
      let issue_date = new Date();
      let _id = field_id(5);
      let open = true;
      let obj;
      
      if (!issue_title || !issue_text || !created_by) {
        return res.json({error: 'required field(s) missing'});
      }
      obj = {
        issue_text,
        issue_title,
        created_by,
        assigned_to: assigned_to || "",
        status_text: status_text || "",
        created_on: issue_date,
        updated_on: issue_date,
        _id,
        open
      };
      project_issue[project] = project_issue[project] || [];
      project_issue[project].push(obj);
      return res.json(obj);
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let {_id} = req.body;
      let fields = Object.keys(req.body);
      
      if (! _id){ 
        return res.json({error: 'missing _id'});
      }
      let hasUpdateFields = fields.some(field => field !== '_id' && req.body[field] !== null);
      if (!hasUpdateFields) {
        return res.json({
          error: 'no update field(s) sent',
          '_id': _id
        });
      }

      let fieldIndex = project_issue[project].findIndex(index => index._id === _id);
      if (fieldIndex === -1) {
        return res.json({
          error: 'could not update',
          '_id': _id
        });
      }

      let projectIndex = project_issue[project][fieldIndex];
      fields.forEach(field => {
        if (field !== '_id' && req.body[field] !== null) {
          projectIndex[field] = req.body[field];
        }
      });
      projectIndex.updated_on = new Date();  
      return res.json({
        result: 'successfully updated',
        '_id': _id
      });
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let {_id} = req.body;

      if (! _id) {
        return res.json({error: 'missing _id'})
      }
      let fieldIndex = project_issue[project].findIndex(index => index._id === _id)
      if (fieldIndex === -1) {
        return res.json({ 
          error: 'could not delete', 
          '_id': _id })
      }
      project_issue[project].splice(fieldIndex, 1);
      return res.json({ 
        result: 'successfully deleted', 
        '_id': _id });    
    });

    const field_id = (length) => {
      let result = "";
      const upper_char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const lower_char = "abcdefghijklmnopqrstuvwxyz";
      const alphabet = upper_char.concat(lower_char);
      const numbers = "0123456789";
      const char_field = alphabet.concat(numbers);

      result = Array.from({ length }, () => 
        char_field.charAt(Math.floor(Math.random() * char_field.length))
      ).join('');
      return result;
    } 
};
