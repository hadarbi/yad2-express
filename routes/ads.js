const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require('sequelize');

/**
 * Route to get ads based on optional query parameters.
 */
router.get('/', function (req, res, next) {
  // Destructure query parameters
  let { approved, titleSearch } = req.query;

  // Set default sorting order
  const order = [['createdAt', 'DESC']];
  // Initialize the where clause object
  const whereClause = {};

  // Check if approved parameter is provided
  if (approved === 'true') {
    whereClause.approved = true;
  } else {
    // Check if user must be an admin
    const mustBeAdminRes = mustBeAdmin(req);
    if (mustBeAdminRes) return mustBeAdminRes;
  }

  // Add title search condition if titleSearch parameter is provided
  if (titleSearch) {
    whereClause.title = { [Op.like]: `%${titleSearch}%` };
  }

  // Query the database for ads based on conditions
  return db.Ad.findAll({ where: whereClause, order })
    .then((ads) => res.send(ads))
    .catch((err) => {
      // Handle errors and send an appropriate response
      console.log('There was an error querying ads', JSON.stringify(err))
      err.error = 1;
      return res.status(400).send(err);
    });
});

/**
 * Route to create a new ad.
 */
router.post('/', function (req, res, next) {
  // Create a new ad in the database
  return db.Ad.create(req.body)
    .then((ad) => res.status(201).send(ad))
    .catch((err) => {
      // Handle errors and send an appropriate response
      console.log('*** error creating a ad', JSON.stringify(err))
      return res.status(400).send(err);
    });
});

/**
 * Route to approve an ad by updating its approval status.
 */
router.post('/:id/approve', function (req, res, next) {
  // Check if user must be an admin
  const mustBeAdminRes = mustBeAdmin(req);
  if (mustBeAdminRes) return mustBeAdminRes;

  // Parse ad ID from the request parameters
  const id = parseInt(req.params.id);

  // Find the ad by its ID
  return db.Ad.findByPk(id)
    .then((ad) => {
      // Update ad's approval status to true
      return ad.update({ approved: true })
        .then(() => res.send(ad))
        .catch((err) => {
          // Handle errors and send an appropriate response
          console.log('***Error updating contact', JSON.stringify(err))
          res.status(400).send(err);
        });
    });
});

/**
 * Route to delete an ad by its ID.
 */
router.delete('/:id', (req, res) => {
  // Check if user must be an admin
  const mustBeAdminRes = mustBeAdmin(req);
  if (mustBeAdminRes) return mustBeAdminRes;

  // Parse ad ID from the request parameters
  const id = parseInt(req.params.id);

  // Find the ad by its ID, then destroy it
  return db.Ad.findByPk(id)
    .then((ad) => ad.destroy({ force: true }))
    .then(() => res.status(204).send())
    .catch((err) => {
      // Handle errors and send an appropriate response
      console.log('***Error deleting ad', JSON.stringify(err))
      res.status(400).send(err);
    });
});

/**
 * Helper function to check if the user is an admin.
 */
function mustBeAdmin(req) {
  if (!req.user?.isAdmin) {
    // If the user is not an admin, send a 401 Unauthorized response
    return res.status(401).send("you must be admin to see unapproved ads.");
  }
}

module.exports = router;
