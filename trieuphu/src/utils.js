import { PRIZES, MILESTONES } from './data';

// Tiền thưởng theo số câu đã trả lời đúng và lý do kết thúc:
// 'win' | 'stop' | 'wrong' | 'timeout'
export const calcPrize = (correctCount, reason) => {
  if (reason === 'win') return PRIZES[PRIZES.length - 1];
  if (reason === 'stop') return correctCount > 0 ? PRIZES[correctCount - 1] : 0;
  // sai hoặc hết giờ: chỉ nhận mốc an toàn cao nhất đã vượt qua
  const passed = MILESTONES.filter((m) => m <= correctCount);
  return passed.length > 0 ? PRIZES[Math.max(...passed) - 1] : 0;
};
