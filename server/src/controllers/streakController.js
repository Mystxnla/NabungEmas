/**
 * streakController.js
 * Controller untuk streak menabung bulanan
 */

const { UserStreak } = require('../models');

const getStreak = async (req, res) => {
  try {
    let streak = await UserStreak.findOne({ where: { user_id: req.user.id } });

    if (!streak) {
      streak = await UserStreak.create({
        user_id: req.user.id,
        current_streak: 0,
        longest_streak: 0,
        last_save_month: null,
      });
    }

    return res.status(200).json({ success: true, data: streak });
  } catch (error) {
    console.error('Error getStreak:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data streak.' });
  }
};

const updateStreak = async (req, res) => {
  try {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    let streak = await UserStreak.findOne({ where: { user_id: req.user.id } });

    if (!streak) {
      streak = await UserStreak.create({
        user_id: req.user.id,
        current_streak: 1,
        longest_streak: 1,
        last_save_month: thisMonth,
      });
      return res.status(200).json({ success: true, data: streak });
    }

    if (streak.last_save_month === thisMonth) {
      return res.status(200).json({ success: true, message: 'Streak sudah diperbarui bulan ini.', data: streak });
    }

    const prevDate = streak.last_save_month ? new Date(`${streak.last_save_month}-01`) : null;
    const isConsecutive = prevDate &&
      now.getFullYear() * 12 + now.getMonth() === prevDate.getFullYear() * 12 + prevDate.getMonth() + 1;

    const newCurrent = isConsecutive ? streak.current_streak + 1 : 1;
    await streak.update({
      current_streak: newCurrent,
      longest_streak: Math.max(streak.longest_streak, newCurrent),
      last_save_month: thisMonth,
    });

    return res.status(200).json({ success: true, data: streak });
  } catch (error) {
    console.error('Error updateStreak:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui streak.' });
  }
};

module.exports = { getStreak, updateStreak };
