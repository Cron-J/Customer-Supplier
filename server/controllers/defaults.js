var CustomerGroup = require('../models/customerGroup').CustomerGroup,
    Tenants = require('../models/tenant').Tenant,
    Boom = require('boom'),
    max = 10,
    min = 1;

var createTenats = function(tenants, current, number, callback) {
  if (current < number) {
    var tenant = {};
    var tenantId = 'tenant ' + parseInt(Math.random() * (max - min) + min);
    var description = tenantId + ' description ' + parseInt(Math.random() * (max - min) + min);
    tenant.name = tenantId;
    tenant.status = 'active',
    tenant.description = 'description ' + description;
    tenant.validFrom = new Date();
    tenant.validTo = new Date();
    var tenantdata = new Tenants(tenant);
    tenantdata.save(function(err, result) {
      if (err) {
        callback(err, null);
      } else {
        createTenats(tenants.concat(result), current + 1, number, callback);
      }
    });
  } else {
    callback(null, tenants);
  }
}

var createCustomerGroup = function(customergroups, current, number, callback) {
  if (current < number) {
    var customergroup = {};
    customergroup.groupName = 'group name ' + parseInt(Math.random() * (max - min) + min);
    var customerdata = new CustomerGroup(customergroup);
    customerdata.save(function(err, result) {
      if (err) {
        callback(err, null);
      } else {
        createCustomerGroup(customergroups.concat(result), current + 1, number, callback);
      }
    });
  } else {
    callback(null, customergroups);
  }
}

exports.Create = function(req, rep) {
  var totals = req.params.numbers ? req.params.numbers : 1;
  var result = {}

  createTenats([], 0, totals, function(err, tenatsresult) {
    if(err) {
      rep(Boom.badImplementation(err));
    } else {
      result.Tenat = tenatsresult;
      createCustomerGroup([], 0, totals, function(customererr, customerresult){
        if (customererr) {
          rep(Boom.badImplementation(customererr));
        } else {
          result.CustomerGroup = customerresult;
          rep(result);
        }
      });
    }
  });
}
