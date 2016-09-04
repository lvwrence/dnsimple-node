'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const expect = require('chai').expect;
const nock = require('nock');

describe('templates', function() {
  describe('#listTemplates', function() {
    var accountId = '1010';
    var fixture = testUtils.fixture('listTemplates/success.http');

    it('supports pagination', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/templates?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId, {page: 1});

      endpoint.done();
      done();
    });

    it('supports extra request options', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/templates?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId, {query: {foo: 'bar'}});

      endpoint.done();
      done();
    });

    it('supports sorting', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/templates?sort=name%3Aasc')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId, {sort: 'name:asc'});

      endpoint.done();
      done();
    });

    it('produces a template list', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId).then(function(response) {
        var templates = response.data;
        expect(templates.length).to.eq(2);
        expect(templates[0].name).to.eq('Alpha');
        expect(templates[0].account_id).to.eq(1010);
        done();
      }, function(error) {
        done(error);
      });
    });

    it('exposes the pagination info', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId).then(function(response) {
        var pagination = response.pagination;
        expect(pagination).to.not.be.null;
        expect(pagination.current_page).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#getTemplate', function() {
    var accountId = '1010';
    var templateId = 'name';

    it('produces a template', function(done) {
      var fixture = testUtils.fixture('getTemplate/success.http');

      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/name')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.getTemplate(accountId, templateId).then(function(response) {
        var template = response.data;
        expect(template.id).to.eq(1);
        expect(template.account_id).to.eq(1010);
        expect(template.name).to.eq('Alpha');
        expect(template.short_name).to.eq('alpha');
        expect(template.description).to.eq('An alpha template.');
        expect(template.created_at).to.eq('2016-03-22T11:08:58.262Z');
        expect(template.updated_at).to.eq('2016-03-22T11:08:58.262Z');
        done();
      }, function(error) {
        done(error);
      });
    });

    describe('when the template does not exist', function() {
      it('produces an error', function(done) {
        var fixture = testUtils.fixture('notfound-template.http');

        nock('https://api.dnsimple.com')
          .get('/v2/1010/templates/name')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.templates.getTemplate(accountId, templateId).then(function(response) {
          done();
        }, function(error) {
          expect(error).to.not.be.null;
          done();
        });
      });
    });
  });

  describe('#createTemplate', function() {
    var accountId = '1010';
    var attributes = {name: 'Beta'};
    var fixture = testUtils.fixture('createTemplate/created.http');

    it('builds the correct request', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .post('/v2/1010/templates', {name: 'Beta'})
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.createTemplate(accountId, attributes);

      endpoint.done();
      done();
    });

    it('produces a template', function(done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/templates')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.createTemplate(accountId, attributes).then(function(response) {
        var template = response.data;
        expect(template.id).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#updateTemplate', function() {
    var accountId = '1010';
    var templateId = 1;
    var attributes = {name: 'Alpha'};
    var fixture = testUtils.fixture('updateTemplate/success.http');

    it('builds the correct request', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .patch('/v2/1010/templates/1', {name: 'Alpha'})
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.updateTemplate(accountId, templateId, attributes);

      endpoint.done();
      done();
    });

    it('produces a template', function(done) {
      nock('https://api.dnsimple.com')
        .patch('/v2/1010/templates/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.updateTemplate(accountId, templateId, attributes).then(function(response) {
        var template = response.data;
        expect(template.id).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });

    describe('when the template does not exist', function() {
      it('produces an error', function(done) {
        var fixture = testUtils.fixture('notfound-template.http');

        nock('https://api.dnsimple.com')
          .patch('/v2/1010/templates/0')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.templates.updateTemplate(accountId, templateId, attributes).then(function(response) {
          done();
        }, function(error) {
          expect(error).to.not.be.null;
          done();
        });
      });
    });
  });

  describe('#deleteTemplate', function() {
    var accountId = '1010';
    var templateId = 1;
    var fixture = testUtils.fixture('deleteTemplate/success.http');

    it('produces nothing', function(done) {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/templates/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.deleteTemplate(accountId, templateId).then(function(response) {
        expect(response).to.eql({});
        done();
      }, function(error) {
        done(error);
      });
    });
  });
});