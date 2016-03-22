var CustomerGroup = require('../models/customerGroup').CustomerGroup,
    SupplierGroup = require('../models/supplierGroup').SupplierGroup,
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

var createSupplierGroup = function(suppliergroups, current, number, callback) {
  if (current < number) {
    var suppliergroup = {};
    suppliergroup.groupName = 'supplier group name ' + parseInt(Math.random() * (max - min) + min);
    var suppliergroupdata = new SupplierGroup(suppliergroup);
    suppliergroupdata.save(function(err, result) {
      if (err) {
        callback(err, null);
      } else {
        createSupplierGroup(suppliergroups.concat(result), current + 1, number, callback);
      }
    });
  } else {
    callback(null, suppliergroups);
  }
}

exports.Create = function(req, rep) {
  var tenantsnumber = req.params.tenantsnumber ? req.params.tenantsnumber : 0;
  var customergroupnumber = req.params.customergroupnumber ? req.params.customergroupnumber : 0;
  var suppliergroupnumber = req.params.suppliergroupnumber ? req.params.suppliergroupnumber : 0;

  var result = {}

  createTenats([], 0, tenantsnumber, function(err, tenatsresult) {
    if(err) {
      rep(Boom.badImplementation(err));
    } else {
      result.Tenat = tenatsresult;
      createCustomerGroup([], 0, customergroupnumber, function(customererr, customerresult) {
        if (customererr) {
          rep(Boom.badImplementation(customererr));
        } else {
          result.CustomerGroup = customerresult;
          createSupplierGroup([], 0, suppliergroupnumber, function(suppliererror, supplierresult) {
            if (suppliererror) {
              rep(Boom.badImplementation(suppliererror));
            } else {
              result.SupplierGroup = supplierresult;
              rep(result);
            }
          });
        }
      });
    }
  });
}
