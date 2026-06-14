/**
 * badgeController.js
 * Controller untuk badge/pencapaian user
 */

const { Badge, UserBadge } = require('../models');

const getUserBadges = async (req, res) => {
  try {
    // Ambil semua badge master
    const allBadges = await Badge.findAll({ order: [['id', 'ASC']] });

    // Ambil badge yang sudah diperoleh user
    const userBadges = await UserBadge.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Badge, as: 'badge' }],
    });

    const unlockedCodes = userBadges.map(ub => ub.badge.code);

    return res.status(200).json({
      success: true,
      data: {
        allBadges,
        unlockedCodes,
        userBadges: userBadges.map(ub => ({
          code: ub.badge.code,
          unlocked_at: ub.unlocked_at,
        })),
      },
    });
  } catch (error) {
    console.error('Error getUserBadges:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data badge.' });
  }
};

const unlockBadge = async (req, res) => {
  try {
    const { badge_code } = req.body;

    const badge = await Badge.findOne({ where: { code: badge_code } });
    if (!badge) {
      return res.status(404).json({ success: false, message: 'Badge tidak ditemukan.' });
    }

    // Cek apakah sudah punya badge ini
    const existing = await UserBadge.findOne({
      where: { user_id: req.user.id, badge_id: badge.id },
    });

    if (existing) {
      return res.status(200).json({ success: true, message: 'Badge sudah diperoleh sebelumnya.', data: existing });
    }

    const userBadge = await UserBadge.create({
      user_id: req.user.id,
      badge_id: badge.id,
      unlocked_at: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: `Selamat! Kamu mendapatkan badge "${badge.name}"!`,
      data: userBadge,
    });
  } catch (error) {
    console.error('Error unlockBadge:', error);
    return res.status(500).json({ success: false, message: 'Gagal unlock badge.' });
  }
};

module.exports = { getUserBadges, unlockBadge };
