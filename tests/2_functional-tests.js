const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const api_url = "/api/issues/apitest";
chai.use(chaiHttp);

suite('Functional Tests', function() {
    let issue_id;
    suite("POST request", () => {
        test("Issue with every field", (done) => {
            chai.request(server)
            .post(api_url)
            .send({
                issue_title: "Issue Tracker Title",
                issue_text: "Issue Tracker Text",
                created_by: "Creator",
                assigned_to: "Me",
                status_text: "In QA"
            })
            .end((err,res) => {
                assert.deepEqual(
                    res.status, 200,
                    res.body.issue_title, "Issue Tracker Title",
                    res.body.issue_text, "Issue Tracker Text",
                    res.body.created_by, "Creator",
                    res.body.assigned_to, "Me",
                    res.body.status_text, "In QA",
                    res.body.open, true
                )
                issue_id = res.body._id;
            })  
            done();
        })
        test("Issue with only required fields", (done) => {
            chai.request(server)
            .post(api_url)
            .send({
                issue_title: "Issue Tracker Title",
                issue_text: "Issue Tracker Text",
                created_by: "Creator"
            })
            .end((err,res) => {
                assert.deepEqual(
                    res.status, 200,
                    res.body.issue_title, "Issue Tracker Title",
                    res.body.issue_text, "Issue Tracker Text",
                    res.body.created_by, "Creator",
                    res.body.assigned_to, "",
                    res.body.status_text, "",
                    res.body.open, true
                )
                issue_id = res.body._id;
            })            
            done();
        })
        test("Issue with missing required fields", (done) => {
            chai.request(server)
            .post(api_url)
            .send({
                issue_title: "Issue Tracker Title"
            })
            .end((err,res) => {
                assert.deepEqual(
                    res.status, 200,
                    res.body.error, "required field(s) missing"
                )
            })
            done();
        })
    })
    suite("GET request", () => {
        test("Issues on a project", (done) => {
            chai.request(server)
            .post(api_url)
            .end((err,res) => {
                assert.equal(
                    res.status, 200
                )
            })
            done();
        })
        test("Issues on a project with one filter", (done) => {
            chai.request(server)
            .post(`${api_url}?created_by=Creator`)
            .end((err,res) => {
                assert.deepEqual(
                    res.status, 200,
                    res.body.created_by, "Creator"
                )
            })
            done();
        })
        test("Issues on a project with multiple filters", (done) => {
            chai.request(server)
            .post(`${api_url}?created_by=Creator&assigned_to=Me`)
            .end((err,res) => {
                assert.deepEqual(
                    res.status, 200,
                    res.body.created_by, "Creator",
                    res.body.assigned_to, "Me"
                )
            })
            done();
        })
    })
    suite("PUT request", () => {
        test("Update one field on an issue", (done) => {
            chai.request(server)
            .put(api_url)
            .send({
                _id: issue_id,
                issue_title: "Issue Tracker Title 2",
            })
            .end((err,res) => {
                assert.deepEqual(
                    res.status, 200,
                    res.body._id, issue_id,
                    res.body.issue_title, "Issue Tracker Title 2",
                    res.body.result, "successfully updated"
                )
            })
            done();
        })
        test("Update multiple fields on an issue", (done) => {
            chai.request(server)
            .put(api_url)
            .send({
                _id: issue_id,
                issue_title: "Issue Tracker Title 2",
                issue_text: "Issue Tracker Text 2",
                created_by: "Creator 2"
            })
            .end((err,res) => {
                assert.deepEqual(
                    res.status, 200,
                    res.body._id, issue_id,
                    res.body.issue_title, "Issue Tracker Title 2",
                    res.body.issue_text, "Issue Tracker Text 2",
                    res.body.created_by, "Creator 2",
                    res.body.result, "successfully updated"
                )
            })
            done();
        })
        test("Update an issue with missing _id", (done) => {
            chai.request(server)
            .put(api_url)
            .send({
                issue_title: "Issue Tracker Title 2"
            })
            .end((err,res) => {
                assert.deepEqual(
                    res.status, 200,
                    res.body.issue_title, "Issue Tracker Title 2",
                    res.body.error, "missing _id"
                )
            })
            done();
        })
        test("Update an issue with no fields to update", (done) => {
            chai.request(server)
            .put(api_url)
            .send({
                _id: issue_id
            })
            .end((err,res) => {
                assert.deepEqual(
                    res.status, 200,
                    res.body._id, issue_id,
                    res.body.error, "no update field(s) sent"
                )
            })
            done();
        })
        test("Update an issue with  an invalid _id", (done) => {
            chai.request(server)
            .put(api_url)
            .send({
                _id: issue_id
            })
            .end((err,res) => {
                assert.deepEqual(
                    res.status, 200,
                    res.body._id, issue_id,
                    res.body.error, "could not update"
                )
            })
            done();
        })
    })
    suite("DELETE request", () => {
        test("Delete an issue", (done) => {
            chai.request(server)
            .delete(api_url)
            .send({
                _id: issue_id
            })
            .end((err,res) => {
                assert.deepEqual(
                    res.status, 200,
                    res.body._id, issue_id,
                    res.body.result, "successfully deleted"
                )
            })
            done();
        })
        test("Delete an issue with an invalid _id", (done) => {
            chai.request(server)
            .delete(api_url)
            .send({
                _id: issue_id
            })
            .end((err,res) => {
                assert.deepEqual(
                    res.status, 200,
                    res.body._id, issue_id,
                    res.body.error, "could not delete"
                )
            })
            done();
        })
        test("Delete an issue with missing _id", (done) => {
            chai.request(server)
            .delete(api_url)
            .send({})
            .end((err,res) => {
                assert.deepEqual(
                    res.status, 200,
                    res.body.error, "missing _id"
                )
            })
            done();
        })
    })
});
