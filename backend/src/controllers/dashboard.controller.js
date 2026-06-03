const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');

const getDashboard = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardStats();
  res.status(200).json({ success: true, data: stats });
});

module.exports = { getDashboard };
